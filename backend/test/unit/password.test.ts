import { describe, expect, it } from "vitest";

import { DUMMY_PASSWORD_HASH, hashPassword, verifyPassword } from "../../src/lib/password.js";

describe("password", () => {
  it("verifies a password against its own hash", async () => {
    const passwordHash = await hashPassword("correct horse battery staple");

    await expect(verifyPassword("correct horse battery staple", passwordHash)).resolves.toBe(true);
  });

  it("rejects the wrong password", async () => {
    const passwordHash = await hashPassword("correct horse battery staple");

    await expect(verifyPassword("Correct horse battery staple", passwordHash)).resolves.toBe(false);
  });

  it("never produces the same hash twice", async () => {
    const [first, second] = await Promise.all([hashPassword("same"), hashPassword("same")]);

    expect(first).not.toBe(second);
  });

  it("uses cost factor 12, matching the seeder", async () => {
    const passwordHash = await hashPassword("whatever");

    expect(passwordHash).toMatch(/^\$2[aby]\$12\$/);
  });

  it("exposes a dummy hash that is a real bcrypt digest no password matches", async () => {
    expect(DUMMY_PASSWORD_HASH).toMatch(/^\$2[aby]\$12\$/);
    await expect(verifyPassword("", DUMMY_PASSWORD_HASH)).resolves.toBe(false);
    await expect(verifyPassword("password", DUMMY_PASSWORD_HASH)).resolves.toBe(false);
  });
});
