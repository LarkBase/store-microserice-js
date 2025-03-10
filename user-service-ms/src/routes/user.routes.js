const express = require("express");
const { getProfile, updateUser, deleteUser } = require("../controllers/profile.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", authenticate, getProfile); // Get profile
router.put("/profile", authenticate, updateUser); // Update profile
router.delete("/profile", authenticate, deleteUser); // Delete account

module.exports = router;
