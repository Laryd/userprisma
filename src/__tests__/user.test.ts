import request from "supertest";
import app from "..";

describe("Authentication Endpoints", () => {
  let token: string; // Store token for authenticated requests
  let userId: number;
  let registeredUserId: number;

  // Register a new user before running tests
  beforeAll(async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "exampleuser1111@example.com",
      password: "password123",
      name: "Test User",
      phone: "1234567890",
    });
    userId = res.body.id;
    console.log(userId, "is the user id");
  });
  it("should register a new user", async () => {
    const resRegister = await request(app).post("/api/auth/register").send({
      email: "muchonge@example.com",
      password: "password123",
      name: "Nw ser",
      phone: "1234567890",
    });
    expect(resRegister.statusCode).toEqual(200);
    expect(resRegister.body).toHaveProperty("id");
    registeredUserId = resRegister.body.id;
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
    console.log(res.body); // Store token for authenticated requests
  });

  it("should return the logged in user profile", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual("testuser@example.com");
  });

  it("should retrieve all users", async () => {
    const res = await request(app)
      .get("/api/auth/users")
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should retrieve a specific user by ID", async () => {
    // using the ID of the user created in beforeAll
    const res = await request(app)
      .get(`/api/auth/users/${userId}`)
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(userId);
  });

  it("should update an existing user", async () => {
    // using the ID of the user created in beforeAll
    const res = await request(app)
      .put(`/api/auth/users/${userId}`)
      .set("Authorization", token)
      .send({
        name: "Updated User",
        isAdmin: true,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Updated User");
  });

  it("should delete an existing user", async () => {
    // using the ID of the user created in beforeAll

    const res = await request(app)
      .delete(`/api/auth/users/${userId}`)
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("User deleted successfully");
  });
  // Clean up the test user created for login and other tests
  afterAll(async () => {
    if (registeredUserId) {
      await request(app)
        .delete(`/api/auth/users/${registeredUserId}`)
        .set("Authorization", token);
    }
  });
});
