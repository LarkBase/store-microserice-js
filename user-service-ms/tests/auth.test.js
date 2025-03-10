const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/database.config");

describe("Authentication API Tests", () => {
  let testUser = { name: "Test User", email: "test@example.com", password: "Test@1234" };

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  test("User Registration - Success", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testUser.email);
  });

  test("User Login - Success", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test("User Login - Invalid Password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "WrongPassword",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
