const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ✅ **Define Users**
  const users = [
    // ✅ **Admins (5)**
    { id: uuidv4(), name: "Admin One", email: "admin1@vibe.store", password: "vibe@123", role: "ADMIN", status: "ACTIVE" },
    { id: uuidv4(), name: "Admin Two", email: "admin2@vibe.store", password: "vibe@123", role: "ADMIN", status: "ACTIVE" },
    { id: uuidv4(), name: "Admin Three", email: "admin3@vibe.store", password: "vibe@123", role: "ADMIN", status: "ACTIVE" },
    { id: uuidv4(), name: "Admin Four", email: "admin4@vibe.store", password: "vibe@123", role: "ADMIN", status: "ACTIVE" },
    { id: uuidv4(), name: "Admin Five", email: "admin5@vibe.store", password: "vibe@123", role: "ADMIN", status: "ACTIVE" },

    // ✅ **Users (5)**
    { id: uuidv4(), name: "User One", email: "user1@vibe.store", password: "vibe@123", role: "USER", status: "ACTIVE" },
    { id: uuidv4(), name: "User Two", email: "user2@vibe.store", password: "vibe@123", role: "USER", status: "ACTIVE" },
    { id: uuidv4(), name: "User Three", email: "user3@vibe.store", password: "vibe@123", role: "USER", status: "ACTIVE" },
    { id: uuidv4(), name: "User Four", email: "user4@vibe.store", password: "vibe@123", role: "USER", status: "ACTIVE" },
    { id: uuidv4(), name: "User Five", email: "user5@vibe.store", password: "vibe@123", role: "USER", status: "ACTIVE" },

    // ✅ **Inactive Users (3)**
    { id: uuidv4(), name: "Inactive One", email: "inactive1@vibe.store", password: "vibe@123", role: "USER", status: "DEACTIVATED" },
    { id: uuidv4(), name: "Inactive Two", email: "inactive2@vibe.store", password: "vibe@123", role: "USER", status: "DEACTIVATED" },
    { id: uuidv4(), name: "Inactive Three", email: "inactive3@vibe.store", password: "vibe@123", role: "USER", status: "DEACTIVATED" },

    // ✅ **Suspended Users (2)**
    { id: uuidv4(), name: "Suspended One", email: "suspended1@vibe.store", password: "vibe@123", role: "USER", status: "SUSPENDED" },
    { id: uuidv4(), name: "Suspended Two", email: "suspended2@vibe.store", password: "vibe@123", role: "USER", status: "SUSPENDED" },
  ];

  // **Hash passwords for security**
  for (let user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  // ✅ **Insert Users**
  await prisma.user.createMany({ data: users });

  // ✅ **Create Sessions for active users only**
  const activeUsers = users.filter(user => user.status === "ACTIVE");
  const sessions = activeUsers.map(user => ({
    id: uuidv4(),
    userId: user.id,
    token: uuidv4(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  }));

  await prisma.session.createMany({ data: sessions });

  // ✅ **Create Password Reset Tokens for 5 users**
  const passwordResets = users.slice(0, 5).map(user => ({
    id: uuidv4(),
    userId: user.id,
    token: uuidv4(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  }));

  await prisma.passwordReset.createMany({ data: passwordResets });

  // ✅ **Create Audit Logs for all users**
  const auditLogs = users.map(user => ({
    id: uuidv4(),
    userId: user.id,
    action: "User Logged In",
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    userAgent: "Mozilla/5.0",
  }));

  await prisma.auditLog.createMany({ data: auditLogs });

  console.log("✅ Seed data added successfully!");
}

// **Execute the seed script**
main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
