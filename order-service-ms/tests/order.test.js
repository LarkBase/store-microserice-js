const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/database.config");
const jwt = require("jsonwebtoken");
const ENV = require("../src/config/env.config");

describe("Order API Tests", () => {
  let adminToken;
  let userToken;
  let orderId;

  beforeAll(async () => {
    console.log("🌱 Seeding database for Order API tests...");

    // ✅ Simulate Admin & User from `user-service`
    const admin = { id: "admin-1", email: "admin@example.com", role: "ADMIN" };
    const user = { id: "user-1", email: "user@example.com", role: "USER" };

    adminToken = jwt.sign(admin, ENV.JWT_SECRET, { expiresIn: "1h" });
    userToken = jwt.sign(user, ENV.JWT_SECRET, { expiresIn: "1h" });

    // ✅ Seed an order for testing
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 500,
        status: "PENDING",
        items: {
          create: [{ productId: "prod-1", quantity: 2, price: 250 }],
        },
        payment: {
          create: { method: "CREDIT_CARD", status: "PENDING" }, // ✅ Matches `PaymentMethod` Enum
        },
        tracking: {
          create: { status: "PENDING" },
        },
      },
    });

    orderId = order.id;
  });

  afterAll(async () => {
    console.log("🧹 Cleaning up database...");
    await prisma.order.deleteMany({});
    await prisma.$disconnect();
  });

  // ✅ Test: Successfully update order status
  test("PUT /api/orders/:id/status - Admin updates order status successfully", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "SHIPPED" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.order.status).toBe("SHIPPED");
  });

  // ❌ Test: Invalid Order ID
  test("PUT /api/orders/:id/status - Invalid order ID", async () => {
    const res = await request(app)
      .put("/api/orders/invalid-order-id/status")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "DELIVERED" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Record to update not found");
  });

  // ❌ Test: Invalid Order Status Enum
  test("PUT /api/orders/:id/status - Invalid status value", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "INVALID_STATUS" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid order status provided.");
  });

  // ❌ Test: Missing Status in Request
  test("PUT /api/orders/:id/status - Missing status field", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Status is required.");
  });

  // ❌ Test: Unauthorized Access (No Token)
  test("PUT /api/orders/:id/status - Unauthorized access", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .send({ status: "DELIVERED" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Unauthorized access.");
  });

  // ✅ Test: Get Order Details - User Can View Own Order
  test("GET /api/orders/:id - User retrieves order successfully", async () => {
    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.order.id).toBe(orderId);
  });

  // ❌ Test: Get Order Details - Unauthorized Access
  test("GET /api/orders/:id - Unauthorized access", async () => {
    const res = await request(app).get(`/api/orders/${orderId}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Unauthorized access.");
  });

  // ✅ Test: Cancel an Order - Admin Cancels Successfully
  test("DELETE /api/orders/:id - Admin cancels order successfully", async () => {
    const res = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Order cancelled");
  });

  // ❌ Test: Cancel an Order - Unauthorized Access
  test("DELETE /api/orders/:id - Unauthorized access", async () => {
    const res = await request(app).delete(`/api/orders/${orderId}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Unauthorized access.");
  });
});
