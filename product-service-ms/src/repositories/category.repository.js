const prisma = require("../config/database.config");

const findAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      products: true, // Include associated products
    },
  });
};

const findCategoryById = async (id) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });
};

const addCategory = async (categoryData) => {
  return prisma.category.create({
    data: {
      name: categoryData.name,
      description: categoryData.description,
    },
  });
};

const modifyCategory = async (id, updateData) => {
  return prisma.category.update({
    where: { id },
    data: {
      name: updateData.name,
      description: updateData.description,
    },
  });
};

const deleteCategoryById = async (id) => {
  return prisma.category.delete({
    where: { id },
  });
};

module.exports = { findAllCategories, findCategoryById, addCategory, modifyCategory, deleteCategoryById };
