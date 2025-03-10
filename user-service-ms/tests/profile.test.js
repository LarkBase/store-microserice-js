const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/database.config");

describe("User Profile API Tests", () => {
  let userToken;

  beforeAll(async () => {
    await prisma.user.deleteMany();

    const res = await request(app).post("/api/auth/register").send({
      name: "Profile Test User",
      email: "profile@example.com",
      password: "Profile@1234",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "profile@example.com",
      password: "Profile@1234",
    });

    userToken = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test("Get User Profile", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("profile@example.com");
  });

  test("Update User Profile", async () => {
    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Updated Profile User" });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Updated Profile User");
  });

  test("Delete User Account", async () => {
    const res = await request(app)
      .delete("/api/users/profile")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });
});
