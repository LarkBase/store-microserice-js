const { PrismaClient } = require("@prisma/client");
const { analyzeAndFixCode } = require("../../utils/aiHelper");
const { findRouteFile , createBranchAndPR } = require("../../utils/githubHelper");

const prisma = new PrismaClient();


const createAlerts = async (req, res) => {
    try {
        let alerts = req.body;
        if (!Array.isArray(alerts)) {
            alerts = [alerts];
        }

        const createdAlerts = await Promise.all(
            alerts.map(async (alert) => {
                // Extracting necessary fields
                const alertData = {
                    alertName: alert.labels?.alertname || "Unknown Alert",
                    severity: alert.labels?.severity || "unknown",
                    description: alert.annotations?.description || "No description",
                    instance: alert.labels?.instance || "Unknown",
                    job: alert.labels?.job || "Unknown",
                    method: alert.labels?.method || "Unknown",
                    route: alert.labels?.route || "Unknown",
                    status: alert.labels?.status || "Unknown",
                    startsAt: alert.startsAt ? new Date(alert.startsAt) : new Date(),
                    endsAt: alert.endsAt ? new Date(alert.endsAt) : new Date(),
                };

                const storedAlert = await prisma.alert.create({
                    data: alertData,
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


const approveAlert = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the alert
        const alert = await prisma.alert.findUnique({ where: { id } });
        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }

        // Ensure AI-suggested code exists
        const aiResponse = await prisma.aIResponse.findFirst({ where: { alertId: id } });
        if (!aiResponse) {
            return res.status(400).json({ message: "No AI-generated fix available." });
        }

        // Generate branch name
        const branchName = `hotfix/${new Date().toISOString().split("T")[0]}`;

        console.log(`🚀 Creating Branch: ${branchName}`);

        // Push AI fix to GitHub
        const result = await createBranchAndPR(alert.job, alert.route, aiResponse.response, aiResponse.explanation, branchName);

        if (result.success) {
            return res.json({ message: "PR Merged Successfully", prUrl: result.prUrl });
        } else {
            return res.status(500).json({ message: "GitHub PR merge failed." });
        }
    } catch (error) {
        console.error("❌ Error approving alert:", error);
        res.status(500).json({ message: "Error approving alert." });
    }
};


module.exports = { createAlerts, getAlerts, getAlertById, updateAlert, deleteAlert, approveAlert };
