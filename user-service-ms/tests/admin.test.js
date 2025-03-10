const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const prisma = require("../src/config/database.config");

describe("Admin API Tests", () => {
  let adminToken;
  let userId;

  beforeAll(async () => {
    try {
      // Check if the admin already exists
      let admin = await prisma.user.findUnique({
        where: { email: "admin@example.com" },
      });

      if (!admin) {
        // Create admin with hashed password
        const hashedPassword = await bcrypt.hash("Admin@1234", 10);
        admin = await prisma.user.create({
          data: { name: "Admin", email: "admin@example.com", password: hashedPassword, role: "ADMIN" },
        });
      }

      // Attempt login
      const res = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "Admin@1234",
      });

      if (!res.body.token) {
        console.error("Admin login failed:", res.body);
        throw new Error("Admin login failed, token not received");
      }

      adminToken = res.body.token;
    } catch (error) {
      console.error("Error in beforeAll:", error);
      throw error;
    }
  });

  test("Admin - Get All Users", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Get All Users Response:", res.body); // Debug log

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  test("Admin - Create User", async () => {
    try {
      // Ensure user does not exist before creating
      let existingUser = await prisma.user.findUnique({
        where: { email: "testuser@example.com" },
      });

      if (existingUser) {
        userId = existingUser.id; // Use existing user ID
        console.log("User already exists, using existing ID:", userId);
        return;
      }

      const res = await request(app)
        .post("/api/admin/users/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Test User", email: "testuser@example.com", password: "Test@1234", role: "USER" });

      console.log("Create User Response:", res.body); // Debug log

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe("testuser@example.com");

      userId = res.body.user.id;
      console.log("Created user ID:", userId);
    } catch (error) {
      console.error("Error in Create User test:", error);
      throw error;
    }
  });

  test("Admin - Get User by ID", async () => {
    if (!userId) {
      console.error("User ID is undefined in Get User test");
      throw new Error("User ID is not assigned correctly");
    }

    const res = await request(app)
      .get(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Get User Response:", res.body); // Debug log

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("testuser@example.com");
  });

  test("Admin - Update User Role", async () => {
    if (!userId) {
      console.error("User ID is undefined in Update User test");
      throw new Error("User ID is not assigned correctly");
    }

    const res = await request(app)
      .put(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "ADMIN" });

    console.log("Update User Response:", res.body); // Debug log

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.role).toBe("ADMIN");
  });

  test("Admin - Delete User", async () => {
    if (!userId) {
      console.error("User ID is undefined in Delete User test");
      throw new Error("User ID is not assigned correctly");
    }

    const res = await request(app)
      .delete(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Delete User Response:", res.body); // Debug log

    expect(res.status).toBe(200);
  });
});
