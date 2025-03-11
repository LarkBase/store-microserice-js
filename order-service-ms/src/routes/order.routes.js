const express = require("express");
const { placeOrder, getOrderDetails, updateOrderStatus, cancelOrder } = require("../controllers/order.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, placeOrder);
router.get("/:id", authenticate, getOrderDetails);
router.put("/:id/status", authenticate, updateOrderStatus);
router.delete("/:id", authenticate, cancelOrder);

module.exports = router;
