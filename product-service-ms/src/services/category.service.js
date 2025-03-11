const { findAllCategories, findCategoryById, addCategory, modifyCategory, deleteCategoryById } = require("../repositories/category.repository");

const getCategories = async () => {
  return findAllCategories();
};

const getCategoryById = async (id) => {
  return findCategoryById(id);
};

const createNewCategory = async (categoryData) => {
  return addCategory(categoryData);
};

const updateExistingCategory = async (id, updateData) => {
  return modifyCategory(id, updateData);
};

const removeCategory = async (id) => {
  return deleteCategoryById(id);
};

module.exports = { getCategories, getCategoryById, createNewCategory, updateExistingCategory, removeCategory };
