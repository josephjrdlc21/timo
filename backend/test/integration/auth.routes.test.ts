import jwt from "jsonwebtoken";
import request from "supertest";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

import { app } from "../../src/app.js";
import { env } from "../../src/config/env.js";
import { prisma } from "../../src/lib/prisma.js";
import { signAccessToken, verifyAccessToken } from "../../src/lib/tokens.js";
import {
  authUserSchema,
  loginResponseSchema,
  refreshResponseSchema,
} from "../helpers/clientSchemas.js";
import {
  cleanupTestUsers,
  countLiveRefreshTokens,
  createTestUser,
  sweepOrphanedTestUsers,
} from "../helpers/db.js";

const LOGIN = "/api/auth/login";
const REFRESH = "/api/auth/refresh";
const LOGOUT = "/api/auth/logout";
const ME = "/api/auth/me";

type Response = Awaited<ReturnType<ReturnType<typeof request>["get"]>>;

/** The `name=value` pair for the refresh cookie, ready to hand back as a Cookie header. */
function refreshCookie(response: Response): string {
  const header = response.headers["set-cookie"] as unknown as string[] | undefined;
  const cookie = header?.find((value) => value.startsWith(`${env.REFRESH_COOKIE_NAME}=`));

  if (!cookie) {
    throw new Error("Response did not set a refresh cookie");
  }

  return cookie.split(";")[0];
}

function cookieValue(cookie: string): string {
  return cookie.slice(cookie.indexOf("=") + 1);
}

async function loginAs(user: { email: string; password: string }): Promise<Response> {
  const response = await request(app)
    .post(LOGIN)
    .send({ email: user.email, password: user.password });

  expect(response.status).toBe(200);
  return response;
}

afterEach(async () => {
  vi.restoreAllMocks();
  await cleanupTestUsers();
});

afterAll(async () => {
  await sweepOrphanedTestUsers();
});

describe("POST /api/auth/login", () => {
  it("returns a token and user matching the client's schema, and sets the refresh cookie", async () => {
    const user = await createTestUser({ roles: ["user"] });

    const response = await loginAs(user);

    const body = loginResponseSchema.parse(response.body);
    expect(body.user).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: ["user"],
    });

    const setCookie = response.headers["set-cookie"] as unknown as string[];
    const cookie = setCookie.find((value) => value.startsWith(`${env.REFRESH_COOKIE_NAME}=`));
    expect(cookie).toBeDefined();
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Path=/api/auth");
    expect(cookie).toContain("SameSite=Lax");
    // The raw token must never appear in the database, only its digest.
    await expect(
      prisma.refreshToken.count({ where: { tokenHash: cookieValue(refreshCookie(response)) } }),
    ).resolves.toBe(0);
  });

  it("reports a wrong password and an unknown email identically", async () => {
    const user = await createTestUser();

    const wrongPassword = await request(app)
      .post(LOGIN)
      .send({ email: user.email, password: "definitely-not-it" });
    const unknownEmail = await request(app)
      .post(LOGIN)
      .send({ email: "timo16-nobody@test.local", password: "definitely-not-it" });

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    // Byte-identical, or the response itself enumerates accounts.
    expect(wrongPassword.body).toEqual(unknownEmail.body);
    expect(wrongPassword.body).toEqual({
      error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
    });
  });

  it("rejects a malformed body before touching the database", async () => {
    const findUnique = vi.spyOn(prisma.user, "findUnique");

    const response = await request(app).post(LOGIN).send({ email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: "email" })]),
    );
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("rejects an empty password without a database lookup", async () => {
    const findUnique = vi.spyOn(prisma.user, "findUnique");

    const response = await request(app)
      .post(LOGIN)
      .send({ email: "timo16-someone@test.local", password: "" });

    expect(response.status).toBe(400);
    expect(findUnique).not.toHaveBeenCalled();
  });
});

describe("POST /api/auth/refresh", () => {
  it("issues a fresh access token and rotates the cookie", async () => {
    const user = await createTestUser({ roles: ["user"] });
    const login = await loginAs(user);
    const original = refreshCookie(login);

    const response = await request(app).post(REFRESH).set("Cookie", original);

    expect(response.status).toBe(200);
    const body = refreshResponseSchema.parse(response.body);
    expect(verifyAccessToken(body.accessToken)).toEqual({ userId: user.id, roles: ["user"] });

    // The cookie must be a different token; the jti is random per issue.
    const rotated = refreshCookie(response);
    expect(cookieValue(rotated)).not.toBe(cookieValue(original));

    // Exactly one live token: the old row was revoked in the same transaction.
    await expect(countLiveRefreshTokens(user.id)).resolves.toBe(1);
  });

  it("rejects a token that has already been rotated away", async () => {
    const user = await createTestUser();
    const login = await loginAs(user);
    const original = refreshCookie(login);

    await request(app).post(REFRESH).set("Cookie", original).expect(200);
    const replay = await request(app).post(REFRESH).set("Cookie", original);

    expect(replay.status).toBe(401);
  });

  it("revokes every live session when a rotated token is replayed", async () => {
    const user = await createTestUser();
    const login = await loginAs(user);
    const original = refreshCookie(login);

    const rotated = await request(app).post(REFRESH).set("Cookie", original).expect(200);
    await request(app).post(REFRESH).set("Cookie", original).expect(401);

    // The replay is treated as a leak, so the successor is killed too.
    await expect(countLiveRefreshTokens(user.id)).resolves.toBe(0);
    await request(app).post(REFRESH).set("Cookie", refreshCookie(rotated)).expect(401);
  });

  it("returns 401 without logging when no cookie is present", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await request(app).post(REFRESH);

    expect(response.status).toBe(401);
    // The cold-boot path for every logged-out visitor: it must not look like a fault.
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("rejects a forged cookie", async () => {
    const forged = jwt.sign({}, "not-the-refresh-secret-not-the-refresh-secret", {
      subject: "whoever",
      jwtid: "forged",
      expiresIn: 60,
    });

    const response = await request(app)
      .post(REFRESH)
      .set("Cookie", `${env.REFRESH_COOKIE_NAME}=${forged}`);

    expect(response.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the cookie and revokes the stored token", async () => {
    const user = await createTestUser();
    const login = await loginAs(user);
    const cookie = refreshCookie(login);

    const response = await request(app).post(LOGOUT).set("Cookie", cookie);

    expect(response.status).toBe(204);
    const cleared = (response.headers["set-cookie"] as unknown as string[]).find((value) =>
      value.startsWith(`${env.REFRESH_COOKIE_NAME}=`),
    );
    expect(cleared).toContain("Path=/api/auth");
    expect(cleared).toMatch(/Expires=Thu, 01 Jan 1970/);

    await expect(countLiveRefreshTokens(user.id)).resolves.toBe(0);
    await request(app).post(REFRESH).set("Cookie", cookie).expect(401);
  });

  it("succeeds with no cookie at all", async () => {
    await request(app).post(LOGOUT).expect(204);
  });

  it("is idempotent", async () => {
    const user = await createTestUser();
    const cookie = refreshCookie(await loginAs(user));

    await request(app).post(LOGOUT).set("Cookie", cookie).expect(204);
    await request(app).post(LOGOUT).set("Cookie", cookie).expect(204);
  });
});

describe("GET /api/auth/me", () => {
  it("returns the user matching the client's schema", async () => {
    const user = await createTestUser({ roles: ["admin", "user"] });
    const { accessToken } = loginResponseSchema.parse((await loginAs(user)).body);

    const response = await request(app).get(ME).set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    const body = authUserSchema.parse(response.body);
    expect(body).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: expect.arrayContaining(["admin", "user"]),
    });
  });

  it("reflects a role change without re-issuing the token", async () => {
    const user = await createTestUser({ roles: ["user"] });
    const { accessToken } = loginResponseSchema.parse((await loginAs(user)).body);

    await prisma.userRole.deleteMany({ where: { userId: user.id } });

    const response = await request(app).get(ME).set("Authorization", `Bearer ${accessToken}`);

    // /me reads the database rather than trusting the token's stale claims.
    expect(response.body.roles).toEqual([]);
  });

  it.each([
    ["no Authorization header", undefined],
    ["a malformed header", "Bearer garbage"],
  ])("returns 401 for %s", async (_label, header) => {
    const pending = request(app).get(ME);
    if (header !== undefined) {
      void pending.set("Authorization", header);
    }

    await pending.expect(401);
  });

  it("returns 401 for an expired access token", async () => {
    const expired = jwt.sign({ roles: [] }, env.JWT_SECRET, {
      subject: "someone",
      expiresIn: -1,
    });

    await request(app).get(ME).set("Authorization", `Bearer ${expired}`).expect(401);
  });

  it("returns 401 when the account behind a valid token is gone", async () => {
    const user = await createTestUser();
    const token = signAccessToken(user.id, []);
    await prisma.user.delete({ where: { id: user.id } });

    await request(app).get(ME).set("Authorization", `Bearer ${token}`).expect(401);
  });
});

describe("CORS", () => {
  it("allows a credentialed request from a dev origin", async () => {
    const response = await request(app)
      .options(LOGIN)
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "POST");

    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("does not echo an origin that is not allowlisted", async () => {
    const response = await request(app)
      .options(LOGIN)
      .set("Origin", "http://evil.example")
      .set("Access-Control-Request-Method", "POST");

    // No allow-origin header means the browser blocks the response.
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
