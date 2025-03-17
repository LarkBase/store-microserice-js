const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let alerts = []; // Store received alerts

// ✅ Accept Prometheus Alerts at `/api/v2/alerts` and `/receive-alert`
app.post(["/receive-alert", "/api/v2/alerts"], (req, res) => {
  console.log("🚨 AI-SRE Alert Received:", JSON.stringify(req.body, null, 2));

  // Store alert
  alerts.push({
    timestamp: new Date().toISOString(),
    alert: req.body,
  });

  res.status(200).send("AI-SRE received the alert successfully!");
});

// ✅ View received alerts via API
app.get("/alerts", (req, res) => {
  res.json(alerts);
});

// Start AI-SRE Service
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ AI-SRE Service running on port ${PORT}`);
});
