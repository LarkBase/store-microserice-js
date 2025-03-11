const express = require("express");
const { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategory);
router.post("/", authenticate, authorizeAdmin, createCategory);
router.put("/:id", authenticate, authorizeAdmin, updateCategory);
router.delete("/:id", authenticate, authorizeAdmin, deleteCategory);

module.exports = router;
