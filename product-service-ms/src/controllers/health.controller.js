const prisma = require("../config/database.config");

const healthCheck = async (req, res) => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      status: "Product-Service is healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = { healthCheck };
