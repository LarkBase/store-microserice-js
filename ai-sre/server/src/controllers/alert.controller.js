const { PrismaClient } = require("@prisma/client");
const { analyzeAndFixCode } = require("../utils/aiHelper");
const { findRouteFile } = require("../utils/githubHelper");

const prisma = new PrismaClient();


const createAlerts = async (req, res) => {
    try {
        let alerts = req.body;
        if (!Array.isArray(alerts)) {
            alerts = [alerts];
        }

        const createdAlerts = await Promise.all(
            alerts.map(async (alert) => {
                const storedAlert = await prisma.alert.create({
                    data: { ...alert },
                });

                console.log(`🚨 Stored alert: ${storedAlert.alertName}`);

                // ✅ If it's a SlowAPIResponse, find the route code
                if (storedAlert.alertName === "SlowAPIResponse" && storedAlert.route !== "Unknown") {
                    console.log("🐢 Detected API Slowness - Fetching source code...");

                    const routeCode = await findRouteFile(storedAlert.job, storedAlert.route);

                    if (routeCode) {
                        console.log("✅ Sending API code to AI for fix...");
                        const aiFix = await analyzeAndFixCode(storedAlert, routeCode.code);

                        if (aiFix) {
                            console.log("✅ AI Suggested Fix:", aiFix);

                            // Store AI response in DB
                            await prisma.aIResponse.create({
                                data: {
                                    alertId: storedAlert.id,
                                    question: storedAlert.description,
                                    response: aiFix.fixedCode,
                                    explanation: aiFix.explanation,
                                },
                            });
                        }
                    }
                }

                return storedAlert;
            })
        );

        res.status(201).json({ message: "Alerts stored successfully", createdAlerts });
    } catch (error) {
        console.error("❌ Error storing alerts:", error);
        res.status(500).json({ message: "Error storing alerts" });
    }
};

// ✅ Get All Alerts (Frontend Fetch)
const getAlerts = async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({ orderBy: { createdAt: "desc" } });
    res.json(alerts);
  } catch (error) {
    console.error("❌ Error fetching alerts:", error);
    res.status(500).json({ message: "Error fetching alerts" });
  }
};

// ✅ Get Alert by ID
const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await prisma.alert.findUnique({ where: { id } });

    if (!alert) return res.status(404).json({ message: "Alert not found" });

    res.json(alert);
  } catch (error) {
    console.error("❌ Error fetching alert:", error);
    res.status(500).json({ message: "Error fetching alert" });
  }
};

// ✅ Update Alert by ID
const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: req.body,
    });

    res.json({ message: "Alert updated", updatedAlert });
  } catch (error) {
    console.error("❌ Error updating alert:", error);
    res.status(500).json({ message: "Error updating alert" });
  }
};

// ✅ Delete Alert by ID
const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.alert.delete({ where: { id } });

    res.json({ message: "Alert deleted" });
  } catch (error) {
    console.error("❌ Error deleting alert:", error);
    res.status(500).json({ message: "Error deleting alert" });
  }
};

module.exports = { createAlerts, getAlerts, getAlertById, updateAlert, deleteAlert };
