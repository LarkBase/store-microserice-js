const prisma = require("../config/database.config");

const addWishlistItem = async (userId, productId) => {
  return prisma.wishlist.create({
    data: { userId, productId },
  });
};

const findUserWishlist = async (userId) => {
  return prisma.wishlist.findMany({
    where: { userId },
  });
};

const removeWishlistItem = async (userId, productId) => {
  const item = await prisma.wishlist.findFirst({
    where: { userId, productId },
  });

  if (!item) return false;

  await prisma.wishlist.delete({
    where: { id: item.id },
  });

  return true;
};

module.exports = { addWishlistItem, findUserWishlist, removeWishlistItem };
