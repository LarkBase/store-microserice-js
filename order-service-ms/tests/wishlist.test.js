const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/database.config");
const jwt = require("jsonwebtoken");
const ENV = require("../src/config/env.config");

describe("Wishlist API Tests", () => {
  let userToken;
  let userId = "user-1";
  let wishlistId;
  let productId = "prod-1";

  beforeAll(async () => {
    const user = { id: userId, email: "user@example.com", role: "USER" };
    userToken = jwt.sign(user, ENV.JWT_SECRET, { expiresIn: "1h" });

    const wishlistItem = await prisma.wishlist.create({ data: { userId, productId } });
    wishlistId = wishlistItem.id;
  });

  afterAll(async () => {
    await prisma.wishlist.deleteMany({});
    await prisma.$disconnect();
  });

  // ✅ Add Product to Wishlist
  test("POST /api/wishlist - Add product to wishlist", async () => {
    const res = await request(app)
      .post("/api/wishlist")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId: "prod-2" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Product added to wishlist successfully.");
  });

  // ❌ Unauthorized Access
  test("POST /api/wishlist - Unauthorized access", async () => {
    const res = await request(app)
      .post("/api/wishlist")
      .send({ productId });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Unauthorized access.");
  });

  // ❌ Duplicate Wishlist Entry
  test("POST /api/wishlist - Duplicate wishlist entry", async () => {
    const res = await request(app)
      .post("/api/wishlist")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ productId });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Product already in wishlist.");
  });

  // ✅ Get Wishlist Items
  test("GET /api/wishlist - Retrieve user wishlist", async () => {
    const res = await request(app)
      .get("/api/wishlist")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.wishlist)).toBe(true);
  });

  // ✅ Remove Product from Wishlist
  test("DELETE /api/wishlist/:productId - Remove product from wishlist", async () => {
    const res = await request(app)
      .delete(`/api/wishlist/${productId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Product removed from wishlist.");
  });

  // ❌ Removing Nonexistent Wishlist Entry
  test("DELETE /api/wishlist/:id - Wishlist entry does not exist", async () => {
    const res = await request(app)
      .delete(`/api/wishlist/nonexistent-id`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Wishlist item not found.");
  });

  // ❌ Unauthorized Access for Delete
  test("DELETE /api/wishlist/:id - Unauthorized access", async () => {
    const res = await request(app).delete(`/api/wishlist/${wishlistId}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Unauthorized access.");
  });
});
