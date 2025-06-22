import { generateJWT, verifyJWT } from "../jwt";

describe("JWT functions", () => {
  it("should correctly generate a JWT and verify it, returning the original userId", async () => {
    const userId = "test-user-id-12345";

    // 1. Generate Token
    const token = await generateJWT(userId);

    // Assert that the token is a non-empty string
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);

    // 2. Verify Token
    const verifiedPayload = await verifyJWT(token);

    // Assert that the payload is not null and contains the correct userId
    expect(verifiedPayload).not.toBeNull();
    expect(verifiedPayload?.userId).toBe(userId);
  });
});
