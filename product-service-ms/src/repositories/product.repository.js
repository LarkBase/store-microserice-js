const prisma = require("../config/database.config");

const findAllProducts = async () => {
  return prisma.product.findMany({
    include: {
      category: true,
      images: true,
      inventory: true,
    },
  });
};

const findProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
      inventory: true,
    },
  });
};

const addProduct = async (productData) => {
  // ✅ Check if category exists before creating product
  const categoryExists = await prisma.category.findUnique({
    where: { id: productData.categoryId },
  });

  if (!categoryExists) {
    throw new Error("Category does not exist. Please provide a valid categoryId.");
  }

  return prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      categoryId: productData.categoryId,
      images: {
        create: productData.images?.map((url) => ({ url })) || [],
      },
      inventory: {
        create: { quantity: productData.stock },
      },
    },
    include: { images: true, inventory: true },
  });
};

const modifyProduct = async (id, updateData) => {
  return prisma.product.update({
    where: { id },
    data: {
      name: updateData.name,
      description: updateData.description,
      price: updateData.price,
      stock: updateData.stock,
      categoryId: updateData.categoryId,
      images: updateData.images
        ? { deleteMany: {}, create: updateData.images.map((url) => ({ url })) }
        : undefined,
      inventory: updateData.stock !== undefined ? { update: { quantity: updateData.stock } } : undefined,
    },
    include: { images: true, inventory: true },
  });
};

const deleteProductById = async (id) => {
  return prisma.product.delete({
    where: { id },
  });
};

module.exports = { findAllProducts, findProductById, addProduct, modifyProduct, deleteProductById };
