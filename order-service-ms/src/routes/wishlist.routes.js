const express = require("express");
const { addToWishlist, getWishlist, removeFromWishlist } = require("../controllers/wishlist.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

// ✅ Add product to wishlist
router.post("/", authenticate, addToWishlist);

// ✅ Get wishlist for user
router.get("/", authenticate, getWishlist);

// ✅ Remove product from wishlist
router.delete("/:productId", authenticate, removeFromWishlist);

module.exports = router;
