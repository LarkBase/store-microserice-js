const { addProductToWishlist, getUserWishlist, deleteWishlistItem } = require("../services/wishlist.service");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const wishlistItem = await addProductToWishlist(req.user.id, productId);
    res.status(201).json({ success: true, message: "Product added to wishlist successfully.", wishlistItem });
  } catch (error) {
    if (error.message === "Product already in wishlist.") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await getUserWishlist(req.user.id);
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const deleted = await deleteWishlistItem(req.user.id, req.params.productId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Wishlist item not found." });
    }
    res.status(200).json({ success: true, message: "Product removed from wishlist." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
