const express = require("express");
const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/", authenticate, authorizeAdmin,createProduct);
router.put("/:id", authenticate, authorizeAdmin,updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
