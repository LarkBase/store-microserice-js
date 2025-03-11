const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // **Simulated Users from `user-service`**
  const users = [
    { id: "user-1", email: "user1@example.com", name: "John Doe" },
    { id: "user-2", email: "user2@example.com", name: "Jane Smith" },
    { id: "user-3", email: "user3@example.com", name: "Alice Brown" },
    { id: "user-4", email: "user4@example.com", name: "Bob Johnson" },
    { id: "user-5", email: "user5@example.com", name: "Eve Davis" },
  ];

  // **Simulated Products from `product-service`**
  const products = [
    { id: "prod-1", name: "Bhujia Sev", price: 150 },
    { id: "prod-2", name: "Motichoor Laddu", price: 300 },
    { id: "prod-3", name: "Dry Fruit Mix", price: 500 },
    { id: "prod-4", name: "Kachori", price: 100 },
    { id: "prod-5", name: "Ghee", price: 550 },
  ];

  // **Seed Orders**
  const ordersData = [
    {
      id: "order-1",
      userId: users[0].id,
      totalAmount: 450,
      status: "PENDING",
      items: [
        { productId: products[0].id, quantity: 2, price: products[0].price },
        { productId: products[1].id, quantity: 1, price: products[1].price },
      ],
      payment: { method: "CREDIT_CARD", status: "PENDING" },
      tracking: { status: "PENDING" },
    },
    {
      id: "order-2",
      userId: users[1].id,
      totalAmount: 300,
      status: "PROCESSING",
      items: [{ productId: products[1].id, quantity: 1, price: products[1].price }],
      payment: { method: "PAYPAL", status: "COMPLETED" },
      tracking: { status: "SHIPPED" },
    },
    {
      id: "order-3",
      userId: users[2].id,
      totalAmount: 600,
      status: "SHIPPED",
      items: [{ productId: products[2].id, quantity: 1, price: products[2].price }],
      payment: { method: "UPI", status: "COMPLETED" },
      tracking: { status: "DELIVERED" },
    },
    {
      id: "order-4",
      userId: users[3].id,
      totalAmount: 100,
      status: "DELIVERED",
      items: [{ productId: products[3].id, quantity: 1, price: products[3].price }],
      payment: { method: "NET_BANKING", status: "COMPLETED" },
      tracking: { status: "DELIVERED" },
    },
    {
      id: "order-5",
      userId: users[4].id,
      totalAmount: 1100,
      status: "CANCELLED",
      items: [
        { productId: products[4].id, quantity: 2, price: products[4].price },
      ],
      payment: { method: "DEBIT_CARD", status: "FAILED" },
      tracking: { status: "CANCELLED" },
    },
  ];

  // **Insert Orders**
  for (const orderData of ordersData) {
    await prisma.order.upsert({
      where: { id: orderData.id },
      update: {},
      create: {
        id: orderData.id,
        userId: orderData.userId,
        totalAmount: orderData.totalAmount,
        status: orderData.status,
        items: { create: orderData.items },
        payment: { create: orderData.payment },
        tracking: { create: orderData.tracking },
      },
    });
  }

  console.log("✅ Orders Seeded!");

  // **Seed Wishlist**
  const wishlistData = [
    { userId: users[0].id, productId: products[0].id },
    { userId: users[1].id, productId: products[2].id },
    { userId: users[2].id, productId: products[3].id },
    { userId: users[3].id, productId: products[4].id },
  ];

  await Promise.all(
    wishlistData.map(item =>
      prisma.wishlist.upsert({
        where: { id: `${item.userId}-${item.productId}` },
        update: {},
        create: item,
      })
    )
  );

  console.log("✅ Wishlist Seeded!");
}

main()
  .catch(e => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
