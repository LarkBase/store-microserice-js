const { addWishlistItem, findUserWishlist, removeWishlistItem } = require("../repositories/wishlist.repository");

const addProductToWishlist = async (userId, productId) => {
  if (!productId) throw new Error("Product ID is required.");

  // ✅ Check if product already exists in the wishlist
  const existingWishlist = await findUserWishlist(userId);
  if (existingWishlist.some((item) => item.productId === productId)) {
    throw new Error("Product already in wishlist.");
  }

  return addWishlistItem(userId, productId);
};

const getUserWishlist = async (userId) => {
  return findUserWishlist(userId);
};

const deleteWishlistItem = async (userId, productId) => {
  return removeWishlistItem(userId, productId);
};

module.exports = { addProductToWishlist, getUserWishlist, deleteWishlistItem };
