import request from "supertest";
import app from "../src/index.js";


describe("🔐 Auth API", () => {
  it("should fail login with wrong credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401); // or whatever your app returns
    expect(res.body).toHaveProperty("message");
  });

  // Add more tests later for successful login, register, etc.
});
