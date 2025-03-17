const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ✅ **Define Users**
  const users = [
    { name: "Admin One", email: "admin1@vibe.store", password: "vibe@123", role: "ADMIN", status: "ACTIVE" },
    { name: "Admin Two", email: "admin2@vibe.store", password: "vibe@123", role: "ADMIN", status: "ACTIVE" },
    { name: "Admin Three", email: "admin3@vibe.store", password: "vibe@123", role: "ADMIN", status: "ACTIVE" },
    { name: "Admin Four", email: "admin4@vibe.store", password: "vibe@123", role: "ADMIN", status: "ACTIVE" },
    { name: "Admin Five", email: "admin5@vibe.store", password: "vibe@123", role: "ADMIN", status: "ACTIVE" },
    { name: "User One", email: "user1@vibe.store", password: "vibe@123", role: "USER", status: "ACTIVE" },
    { name: "User Two", email: "user2@vibe.store", password: "vibe@123", role: "USER", status: "ACTIVE" },
    { name: "User Three", email: "user3@vibe.store", password: "vibe@123", role: "USER", status: "ACTIVE" },
    { name: "User Four", email: "user4@vibe.store", password: "vibe@123", role: "USER", status: "ACTIVE" },
    { name: "User Five", email: "user5@vibe.store", password: "vibe@123", role: "USER", status: "ACTIVE" },
    { name: "Inactive One", email: "inactive1@vibe.store", password: "vibe@123", role: "USER", status: "DEACTIVATED" },
    { name: "Inactive Two", email: "inactive2@vibe.store", password: "vibe@123", role: "USER", status: "DEACTIVATED" },
    { name: "Inactive Three", email: "inactive3@vibe.store", password: "vibe@123", role: "USER", status: "DEACTIVATED" },
    { name: "Suspended One", email: "suspended1@vibe.store", password: "vibe@123", role: "USER", status: "SUSPENDED" },
    { name: "Suspended Two", email: "suspended2@vibe.store", password: "vibe@123", role: "USER", status: "SUSPENDED" },
  ];

  let createdUsers = [];

  for (let user of users) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        user.id = uuidv4();
        user.password = await bcrypt.hash(user.password, 10);
        const newUser = await prisma.user.create({ data: user });
        createdUsers.push(newUser);
        console.log(`✅ Inserted user: ${user.email}`);
      } else {
        console.log(`⚠️ Skipped existing user: ${user.email}`);
        createdUsers.push(existingUser); // Add existing users to avoid foreign key issues
      }
    } catch (error) {
      console.error(`❌ Error inserting user ${user.email}:`, error);
    }
  }

  // ✅ **Create Sessions for active users only (ensuring valid userIds)**
  const activeUsers = createdUsers.filter(user => user.status === "ACTIVE");
  const sessions = activeUsers.map(user => ({
    id: uuidv4(),
    userId: user.id,
    token: uuidv4(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  }));

  if (sessions.length > 0) {
    try {
      await prisma.session.createMany({ data: sessions });
      console.log("✅ Sessions created for active users.");
    } catch (error) {
      console.error("❌ Error creating sessions:", error);
    }
  } else {
    console.log("⚠️ No new sessions created (no active users).");
  }

  // ✅ **Create Password Reset Tokens for first 5 users**
  const passwordResets = createdUsers.slice(0, 5).map(user => ({
    id: uuidv4(),
    userId: user.id,
    token: uuidv4(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  }));

  if (passwordResets.length > 0) {
    try {
      await prisma.passwordReset.createMany({ data: passwordResets });
      console.log("✅ Password reset tokens created.");
    } catch (error) {
      console.error("❌ Error creating password reset tokens:", error);
    }
  }

  // ✅ **Create Audit Logs for all users**
  const auditLogs = createdUsers.map(user => ({
    id: uuidv4(),
    userId: user.id,
    action: "User Logged In",
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    userAgent: "Mozilla/5.0",
  }));

  if (auditLogs.length > 0) {
    try {
      await prisma.auditLog.createMany({ data: auditLogs });
      console.log("✅ Audit logs created.");
    } catch (error) {
      console.error("❌ Error creating audit logs:", error);
    }
  }

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
