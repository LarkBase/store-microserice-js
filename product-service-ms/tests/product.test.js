const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const ENV = require("../src/config/env.config");

describe("Product API Tests", () => {
  let adminToken;
  let userToken;
  let productId;
  let categoryId;

  beforeAll(async () => {
    // ✅ Ensure categories exist
    const categoryRes = await request(app).post("/api/categories").send({
      name: "Namkeen",
      description: "Spicy and savory snacks.",
    });

    categoryId = categoryRes.body.category.id;

    // ✅ Simulate JWT from user-service (Mock Admin & User)
    adminToken = jwt.sign({ id: "admin-1", email: "admin@example.com", role: "ADMIN" }, ENV.JWT_SECRET, {
      expiresIn: "1h",
    });

    userToken = jwt.sign({ id: "user-1", email: "user@example.com", role: "USER" }, ENV.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  test("POST /api/products - Create Product (Admin Only)", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Bhujia Sev",
        description: "Crispy, spicy gram flour sticks.",
        price: 150,
        stock: 50,
        categoryId,
        images: ["https://example.com/bhujia.jpg"],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    productId = res.body.product.id;
  });

  test("POST /api/products - Unauthorized User Cannot Create Product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Kachori",
        description: "Flaky and crispy deep-fried snack filled with spices.",
        price: 100,
        stock: 40,
        categoryId,
        images: ["https://example.com/kachori.jpg"],
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Access denied. Admins only.");
  });
});
