const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log("🌱 Seeding database...");

    // ✅ **Create Categories**
    const categoryData = [
      { name: "Namkeen", description: "Spicy and savory snacks." },
      { name: "Sweets", description: "Traditional Indian sweets." },
      { name: "Bakery", description: "Cookies, biscuits, and cakes." },
      { name: "Dry Fruits", description: "Healthy dry fruit options." },
      { name: "Beverages", description: "Refreshing drinks and juices." },
      { name: "Dairy", description: "Milk, cheese, and dairy products." },
      { name: "Chocolates", description: "Assorted chocolates and treats." },
      { name: "Spices", description: "Authentic Indian spices and masalas." },
      { name: "Pickles", description: "Tangy and spicy pickles." },
      { name: "Instant Foods", description: "Ready-to-eat meals and snacks." },
    ];

    const categories = await Promise.all(
      categoryData.map(category => prisma.category.create({ data: category }))
    );

    console.log("✅ Categories Seeded!");

    // ✅ **Create Products**
    const productData = [
      { name: "Bhujia Sev", description: "Crispy, spicy gram flour sticks.", price: 150, stock: 75, category: "Namkeen", imageUrl: "https://example.com/bhujia.jpg" },
      { name: "Aloo Bhujia", description: "Crunchy potato and gram flour mix.", price: 140, stock: 65, category: "Namkeen", imageUrl: "https://example.com/aloo-bhujia.jpg" },
      { name: "Motichoor Laddu", description: "Soft and melt-in-mouth laddus.", price: 300, stock: 50, category: "Sweets", imageUrl: "https://example.com/laddu.jpg" },
      { name: "Kaju Katli", description: "Premium cashew barfi.", price: 450, stock: 40, category: "Sweets", imageUrl: "https://example.com/kaju-katli.jpg" },
      { name: "Jeera Biscuits", description: "Crispy biscuits with cumin flavor.", price: 200, stock: 60, category: "Bakery", imageUrl: "https://example.com/jeera-biscuits.jpg" },
      { name: "Fruit Cake", description: "Delicious and moist fruit cake.", price: 350, stock: 30, category: "Bakery", imageUrl: "https://example.com/fruit-cake.jpg" },
      { name: "Almonds", description: "Premium quality almonds.", price: 600, stock: 45, category: "Dry Fruits", imageUrl: "https://example.com/almonds.jpg" },
      { name: "Cashews", description: "Rich and crunchy cashews.", price: 700, stock: 35, category: "Dry Fruits", imageUrl: "https://example.com/cashews.jpg" },
      { name: "Mango Juice", description: "Refreshing mango juice.", price: 120, stock: 80, category: "Beverages", imageUrl: "https://example.com/mango-juice.jpg" },
      { name: "Lassi", description: "Sweet and creamy yogurt drink.", price: 100, stock: 90, category: "Beverages", imageUrl: "https://example.com/lassi.jpg" },
      { name: "Paneer", description: "Soft and fresh paneer cubes.", price: 350, stock: 25, category: "Dairy", imageUrl: "https://example.com/paneer.jpg" },
      { name: "Ghee", description: "Pure and aromatic desi ghee.", price: 550, stock: 30, category: "Dairy", imageUrl: "https://example.com/ghee.jpg" },
      { name: "Dark Chocolate", description: "Premium dark chocolate.", price: 250, stock: 55, category: "Chocolates", imageUrl: "https://example.com/dark-chocolate.jpg" },
      { name: "Milk Chocolate", description: "Smooth and creamy milk chocolate.", price: 220, stock: 60, category: "Chocolates", imageUrl: "https://example.com/milk-chocolate.jpg" },
      { name: "Turmeric Powder", description: "High-quality turmeric powder.", price: 180, stock: 70, category: "Spices", imageUrl: "https://example.com/turmeric.jpg" },
      { name: "Red Chili Powder", description: "Fiery red chili powder.", price: 200, stock: 50, category: "Spices", imageUrl: "https://example.com/red-chili.jpg" },
      { name: "Mango Pickle", description: "Tangy and spicy mango pickle.", price: 150, stock: 65, category: "Pickles", imageUrl: "https://example.com/mango-pickle.jpg" },
      { name: "Lemon Pickle", description: "Traditional lemon pickle.", price: 140, stock: 70, category: "Pickles", imageUrl: "https://example.com/lemon-pickle.jpg" },
      { name: "Cup Noodles", description: "Instant cup noodles.", price: 100, stock: 90, category: "Instant Foods", imageUrl: "https://example.com/cup-noodles.jpg" },
      { name: "Ready-to-Eat Dal Makhani", description: "Rich and creamy dal makhani.", price: 180, stock: 85, category: "Instant Foods", imageUrl: "https://example.com/dal-makhani.jpg" },
    ];

    const categoryMap = Object.fromEntries(categories.map(c => [c.name, c.id]));

    await Promise.all(
      productData.map(product =>
        prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: categoryMap[product.category],
            images: { create: [{ url: product.imageUrl }] },
            inventory: { create: { quantity: product.stock } },
          },
        })
      )
    );

    console.log("✅ Products Seeded!");

    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// **Execute the seed script**
seedData();
