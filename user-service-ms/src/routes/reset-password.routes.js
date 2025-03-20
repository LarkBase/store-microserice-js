const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../config/database.config");

const router = express.Router();

// Reset Password API
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    console.log("❌ Missing email or password in request");
    return res.status(400).json({ message: "Email and password are required" });
  }

  console.log(`🔎 Searching for user: ${email}`);

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    // Removed forced delay
    console.log(`🔐 Hashing new password for ${email}`);

    const hashedPassword = await bcrypt.hash(newPassword, 10); // Use async hashing

    console.log(`🔄 Updating password for ${email}`);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log(`✅ Password reset successful for ${email}`);

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Critical Error in Reset Password API:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;