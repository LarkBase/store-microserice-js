const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/database.config");
const jwt = require("jsonwebtoken");
const ENV = require("../src/config/env.config");

describe("Payment API Tests", () => {
  let adminToken;
  let userToken;
  let paymentId;
  let orderId;

  beforeAll(async () => {
    // ✅ Simulate Users
    const admin = { id: "admin-1", email: "admin@example.com", role: "ADMIN" };
    const user = { id: "user-1", email: "user@example.com", role: "USER" };

    adminToken = jwt.sign(admin, ENV.JWT_SECRET, { expiresIn: "1h" });
    userToken = jwt.sign(user, ENV.JWT_SECRET, { expiresIn: "1h" });

    // ✅ Seed an order for payment processing
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 450,
        status: "PENDING",
        items: {
          create: [{ productId: "prod-1", quantity: 2, price: 150 }],
        },
      },
    });

    orderId = order.id;
  });

  afterAll(async () => {
    await prisma.payment.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.$disconnect();
  });

  // ✅ Test: Process a Payment Successfully
  test("POST /api/payments - Process payment successfully", async () => {
    const res = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        orderId,
        method: "CREDIT_CARD",
        amount: 450,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.payment.status).toBe("PENDING");

    paymentId = res.body.payment.id;
  });

  // ❌ Test: Process Payment with Missing Fields
  test("POST /api/payments - Missing payment fields", async () => {
    const res = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${userToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Order ID, Payment Method, and Amount are required.");
  });

  // ✅ Test: Fetch Payment Details Successfully
  test("GET /api/payments/:id - Get payment details", async () => {
    const res = await request(app)
      .get(`/api/payments/${paymentId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.payment.id).toBe(paymentId);
  });

  // ❌ Test: Fetch Payment Details with Invalid ID
  test("GET /api/payments/:id - Payment not found", async () => {
    const res = await request(app)
      .get("/api/payments/invalid-id")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Payment not found");
  });

  // ✅ Test: Admin Updates Payment Status
  test("PUT /api/payments/:id/status - Admin updates payment status", async () => {
    const res = await request(app)
      .put(`/api/payments/${paymentId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "COMPLETED" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.payment.status).toBe("COMPLETED");
  });

  // ❌ Test: Invalid Payment Status Update
  test("PUT /api/payments/:id/status - Invalid status update", async () => {
    const res = await request(app)
      .put(`/api/payments/${paymentId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "INVALID_STATUS" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid payment status provided.");
  });

  // ❌ Test: Unauthorized Access (No Token)
  test("PUT /api/payments/:id/status - Unauthorized access", async () => {
    const res = await request(app)
      .put(`/api/payments/${paymentId}/status`)
      .send({ status: "COMPLETED" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Unauthorized access.");
  });
});
