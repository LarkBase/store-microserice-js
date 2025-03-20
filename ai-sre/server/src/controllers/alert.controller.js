const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ✅ Create Alert (Used by Prometheus)
const createAlerts = async (req, res) => {
    try {
      let alerts = req.body;
  
      // ✅ Convert single alert object to an array
      if (!Array.isArray(alerts)) {
        alerts = [alerts];
      }
  
      const createdAlerts = await Promise.all(
        alerts.map((alert) =>
          prisma.alert.create({
            data: {
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
            },
          })
        )
      );
  
      console.log(`🚨 Stored ${createdAlerts.length} alerts`);
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
