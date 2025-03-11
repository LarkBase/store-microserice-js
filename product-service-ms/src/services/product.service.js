const { findAllProducts, findProductById, addProduct, modifyProduct, deleteProductById } = require("../repositories/product.repository");

const getProducts = async () => {
  return findAllProducts();
};

const getProductById = async (id) => {
  return findProductById(id);
};

const createNewProduct = async (productData) => {
  return addProduct(productData);
};

const updateExistingProduct = async (id, updateData) => {
  return modifyProduct(id, updateData);
};

const removeProduct = async (id) => {
  return deleteProductById(id);
};

module.exports = { getProducts, getProductById, createNewProduct, updateExistingProduct, removeProduct };
