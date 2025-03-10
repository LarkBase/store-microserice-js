const express = require("express");
const { getUsers, getUser, createUser, updateUser, deleteUser } = require("../controllers/admin.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/users", authenticate, authorizeAdmin, getUsers);
router.get("/users/:id", authenticate, authorizeAdmin, getUser);
router.post("/users/create", authenticate, authorizeAdmin, createUser);
router.put("/users/:id", authenticate, authorizeAdmin, updateUser);
router.delete("/users/:id", authenticate, authorizeAdmin, deleteUser);

module.exports = router;
