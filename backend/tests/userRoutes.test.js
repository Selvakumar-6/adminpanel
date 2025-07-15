jest.setTimeout(30000); // 30 seconds

require("dotenv").config();
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const router = require("../routes/userRoutes");
app.use("/api", router);

beforeAll(async () => {
  console.log("Connecting to DB:", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Role-based Access", () => {
  let adminToken = "";
  let userToken = "";
  let createdUserId = "";

  it("should register and login an admin", async () => {
    const email = `admin${Date.now()}@mail.com`;
    await request(app)
      .post("/api/register")
      .send({ name: "Admin", email, password: "123456", role: "admin" });
    const res = await request(app)
      .post("/api/login")
      .send({ email, password: "123456" });
    adminToken = res.body.token;
    expect(res.statusCode).toBe(200);
  });

  it("should register and login a user", async () => {
    const email = `user${Date.now()}@mail.com`;
    await request(app)
      .post("/api/register")
      .send({ name: "User", email, password: "123456", role: "user" });
    const res = await request(app)
      .post("/api/login")
      .send({ email, password: "123456" });
    userToken = res.body.token;
    createdUserId = res.body.user._id;
    expect(res.statusCode).toBe(200);
  });

  it("admin can get all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(1);
  });

  it("user can only get their own data", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(createdUserId);
  });

  it("user cannot delete another user", async () => {
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  it("admin can delete a user", async () => {
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted");
  });
});
