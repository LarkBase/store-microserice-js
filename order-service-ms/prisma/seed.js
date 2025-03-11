const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // **Simulated Users from `user-service`**
  const user1 = { id: "user-1", email: "user1@example.com", name: "John Doe" };
  const user2 = { id: "user-2", email: "user2@example.com", name: "Jane Smith" };

  // **Simulated Products from `product-service`**
  const product1 = { id: "prod-1", name: "Bhujia Sev", price: 150 };
  const product2 = { id: "prod-2", name: "Motichoor Laddu", price: 300 };

  // **Seed Orders**
  const order1 = await prisma.order.create({
    data: {
      id: "order-1",
      userId: user1.id,
      totalAmount: 450,
      status: "PENDING",
      items: {
        create: [
          { productId: product1.id, quantity: 2, price: product1.price },
          { productId: product2.id, quantity: 1, price: product2.price },
        ],
      },
      payment: {
        create: {
          method: "CREDIT_CARD", // ✅ Fixed ENUM value
          status: "PENDING",
        },
      },
      tracking: {
        create: {
          status: "PENDING",
        },
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      id: "order-2",
      userId: user2.id,
      totalAmount: 300,
      status: "PROCESSING",
      items: {
        create: [{ productId: product2.id, quantity: 1, price: product2.price }],
      },
      payment: {
        create: {
          method: "PAYPAL", // ✅ Fixed ENUM value
          status: "COMPLETED",
        },
      },
      tracking: {
        create: {
          status: "SHIPPED",
        },
      },
    },
  });

  console.log("✅ Seed data added successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
