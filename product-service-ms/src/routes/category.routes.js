const express = require("express");
const { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategory);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
