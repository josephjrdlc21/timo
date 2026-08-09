import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";

import { env } from "../../src/config/env.js";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../src/lib/tokens.js";

describe("access tokens", () => {
  it("round-trips the user id and roles", () => {
    const token = signAccessToken("user-1", ["admin", "user"]);

    expect(verifyAccessToken(token)).toEqual({ userId: "user-1", roles: ["admin", "user"] });
  });

  it("defaults roles to an empty array when the claim is absent", () => {
    const token = jwt.sign({}, env.JWT_SECRET, { subject: "user-1", expiresIn: 60 });

    expect(verifyAccessToken(token)).toEqual({ userId: "user-1", roles: [] });
  });

  it("rejects a tampered token", () => {
    const token = signAccessToken("user-1", ["admin"]);
    const tampered = `${token.slice(0, -3)}aaa`;

    expect(verifyAccessToken(tampered)).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = jwt.sign({ roles: [] }, env.JWT_SECRET, { subject: "user-1", expiresIn: -10 });

    expect(verifyAccessToken(token)).toBeNull();
  });

  it("rejects a token signed with the refresh secret", () => {
    const { token } = signRefreshToken("user-1");

    expect(verifyAccessToken(token)).toBeNull();
  });

  it("rejects a token with no subject", () => {
    const token = jwt.sign({ roles: [] }, env.JWT_SECRET, { expiresIn: 60 });

    expect(verifyAccessToken(token)).toBeNull();
  });
});

describe("refresh tokens", () => {
  it("round-trips the user id and jti", () => {
    const { token, jti } = signRefreshToken("user-1");

    expect(verifyRefreshToken(token)).toEqual({ userId: "user-1", jti });
  });

  it("issues a unique jti per token", () => {
    const first = signRefreshToken("user-1");
    const second = signRefreshToken("user-1");

    expect(first.jti).not.toBe(second.jti);
    expect(first.token).not.toBe(second.token);
  });

  it("reports an expiry that matches the configured TTL", () => {
    const before = Date.now();
    const { expiresAt } = signRefreshToken("user-1");
    const expected = before + env.JWT_REFRESH_TTL_SECONDS * 1000;

    // Signed `exp` has second granularity, so allow a couple of seconds' slack.
    expect(Math.abs(expiresAt.getTime() - expected)).toBeLessThan(2000);
  });

  it("rejects a token signed with the access secret", () => {
    const token = signAccessToken("user-1", []);

    expect(verifyRefreshToken(token)).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = jwt.sign({}, env.JWT_REFRESH_SECRET, {
      subject: "user-1",
      jwtid: "abc",
      expiresIn: -10,
    });

    expect(verifyRefreshToken(token)).toBeNull();
  });

  it("rejects garbage", () => {
    expect(verifyRefreshToken("not-a-jwt")).toBeNull();
    expect(verifyRefreshToken("")).toBeNull();
  });
});

describe("hashToken", () => {
  it("is deterministic", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
  });

  it("produces a 64-character hex digest", () => {
    expect(hashToken("abc")).toMatch(/^[0-9a-f]{64}$/);
  });

  it("differs for different input", () => {
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });

  it("does not contain the token itself", () => {
    const { token } = signRefreshToken("user-1");

    expect(hashToken(token)).not.toContain(token);
  });
});
