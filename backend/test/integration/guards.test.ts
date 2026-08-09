import express, { type Express } from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { env } from "../../src/config/env.js";
import { signAccessToken } from "../../src/lib/tokens.js";
import { errorHandler } from "../../src/middleware/errorHandler.js";
import { requireAuth } from "../../src/middleware/requireAuth.js";
import { requireRole } from "../../src/middleware/requireRole.js";

/** A throwaway app, so the guards are tested without dragging in the database. */
function buildApp(): { app: Express; handler: ReturnType<typeof vi.fn> } {
  const handler = vi.fn((_req: express.Request, res: express.Response) => {
    res.status(200).json({ ok: true });
  });

  const app = express();
  app.get("/protected", requireAuth, handler);
  app.get("/admin-only", requireAuth, requireRole("admin"), handler);
  app.get("/staff", requireAuth, requireRole("admin", "auditor"), handler);
  app.get("/role-without-auth", requireRole("admin"), handler);
  app.use(errorHandler);

  return { app, handler };
}

describe("requireAuth", () => {
  it("passes a valid bearer token through and exposes the claims", async () => {
    const { app, handler } = buildApp();
    const token = signAccessToken("user-1", ["user"]);

    const response = await request(app).get("/protected").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(handler).toHaveBeenCalledOnce();
    const [req] = handler.mock.calls[0];
    expect(req.auth).toEqual({ userId: "user-1", roles: ["user"] });
  });

  it.each([
    ["no Authorization header", undefined],
    ["an empty bearer", "Bearer "],
    ["a non-bearer scheme", "Basic dXNlcjpwYXNz"],
    ["garbage in place of a token", "Bearer not-a-jwt"],
  ])("rejects %s with 401 and never runs the handler", async (_label, header) => {
    const { app, handler } = buildApp();

    const req = request(app).get("/protected");
    if (header !== undefined) {
      void req.set("Authorization", header);
    }
    const response = await req;

    expect(response.status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
  });

  it("rejects an expired token with 401", async () => {
    const { app, handler } = buildApp();
    const expired = jwt.sign({ roles: ["user"] }, env.JWT_SECRET, {
      subject: "user-1",
      expiresIn: -1,
    });

    const response = await request(app).get("/protected").set("Authorization", `Bearer ${expired}`);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_TOKEN");
    expect(handler).not.toHaveBeenCalled();
  });

  it("rejects a token signed with the refresh key", async () => {
    const { app } = buildApp();
    const wrongKey = jwt.sign({ roles: ["admin"] }, env.JWT_REFRESH_SECRET, {
      subject: "user-1",
      expiresIn: 60,
    });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${wrongKey}`);

    expect(response.status).toBe(401);
  });
});

describe("requireRole", () => {
  it("allows a caller holding the required role", async () => {
    const { app, handler } = buildApp();
    const token = signAccessToken("user-1", ["admin"]);

    const response = await request(app).get("/admin-only").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("allows a caller holding any one of several accepted roles", async () => {
    const { app } = buildApp();
    const token = signAccessToken("user-1", ["auditor"]);

    const response = await request(app).get("/staff").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("returns 403, not 401, when the caller lacks the role", async () => {
    const { app, handler } = buildApp();
    const token = signAccessToken("user-1", ["user"]);

    const response = await request(app).get("/admin-only").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
    expect(handler).not.toHaveBeenCalled();
  });

  it("returns 403 when the caller has no roles at all", async () => {
    const { app } = buildApp();
    const token = signAccessToken("user-1", []);

    const response = await request(app).get("/admin-only").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("returns 401 when mounted without requireAuth having run", async () => {
    const { app, handler } = buildApp();

    const response = await request(app).get("/role-without-auth");

    expect(response.status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
  });
});
