const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const seedData = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Categories
    const categories = await prisma.$transaction([
      prisma.category.create({ data: { name: "Namkeen", description: "Spicy and savory snacks." } }),
      prisma.category.create({ data: { name: "Sweets", description: "Traditional Indian sweets." } }),
      prisma.category.create({ data: { name: "Bakery", description: "Cookies, biscuits, and cakes." } }),
      prisma.category.create({ data: { name: "Dry Fruits", description: "Healthy dry fruit options." } }),
    ]);

    console.log("✅ Categories Seeded!");

    // Products
    const products = await prisma.$transaction([
      prisma.product.create({
        data: {
          name: "Bhujia Sev",
          description: "Crispy, spicy gram flour sticks.",
          price: 150,
          stock: 50,
          categoryId: categories[0].id, // Namkeen
          images: { create: [{ url: "https://example.com/bhujia.jpg" }] },
          inventory: { create: { quantity: 50 } },
        },
      }),
      prisma.product.create({
        data: {
          name: "Motichoor Laddu",
          description: "Delicious, soft, and melt-in-mouth laddus.",
          price: 300,
          stock: 30,
          categoryId: categories[1].id, // Sweets
          images: { create: [{ url: "https://example.com/laddu.jpg" }] },
          inventory: { create: { quantity: 30 } },
        },
      }),
      prisma.product.create({
        data: {
          name: "Kachori",
          description: "Flaky and crispy deep-fried snack filled with spices.",
          price: 100,
          stock: 40,
          categoryId: categories[0].id, // Namkeen
          images: { create: [{ url: "https://example.com/kachori.jpg" }] },
          inventory: { create: { quantity: 40 } },
        },
      }),
      prisma.product.create({
        data: {
          name: "Dry Fruit Mix",
          description: "Premium mix of almonds, cashews, and pistachios.",
          price: 500,
          stock: 20,
          categoryId: categories[3].id, // Dry Fruits
          images: { create: [{ url: "https://example.com/dry-fruits.jpg" }] },
          inventory: { create: { quantity: 20 } },
        },
      }),
    ]);

    console.log("✅ Products Seeded!");

    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedData();
