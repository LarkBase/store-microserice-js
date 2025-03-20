const express = require("express");
const { getAIResponse, deleteAIResponse } = require("../controllers/aiResponse.controller");

const router = express.Router();

// ✅ Fetch AI Response for an alert
router.get("/ai-response/:alertId", getAIResponse);

// ✅ Delete AI Response
router.delete("/ai-response/:alertId", deleteAIResponse);

module.exports = router;
