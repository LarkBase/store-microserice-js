const express = require("express");
const { analyzeLogsController } = require("../controllers/aiAnalyzer.controller");

const router = express.Router();

router.post("/analyze", analyzeLogsController);

module.exports = router;
