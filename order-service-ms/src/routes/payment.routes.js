const express = require("express");
const { processPayment, getPaymentDetails, updatePaymentStatus } = require("../controllers/payment.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, processPayment);
router.get("/:id", authenticate, getPaymentDetails);
router.put("/:id/status", authenticate, updatePaymentStatus);

module.exports = router;
