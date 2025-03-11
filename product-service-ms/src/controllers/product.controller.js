const { getProducts, getProductById, createNewProduct, updateExistingProduct, removeProduct } = require("../services/product.service");

const getAllProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
    try {
      const product = await createNewProduct(req.body);
      res.status(201).json({ success: true, product });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

const updateProduct = async (req, res) => {
  try {
    const product = await updateExistingProduct(req.params.id, req.body);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await removeProduct(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct };
