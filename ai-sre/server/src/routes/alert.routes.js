const express = require("express");
const {
  createAlerts,
  getAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
} = require("../controllers/alert.controller");

const router = express.Router();

// 🔥 Routes for AI-SRE Alerts
router.post("/api/v2/alerts", createAlerts); // Prometheus will send alerts here
router.get("/alerts", getAlerts); // Get all alerts
router.get("/alerts/:id", getAlertById); // Get alert by ID
router.put("/alerts/:id", updateAlert); // Update an alert
router.post("/alerts/:id/approve", approveAlert);
router.delete("/alerts/:id", deleteAlert); // Delete an alert


module.exports = router;
