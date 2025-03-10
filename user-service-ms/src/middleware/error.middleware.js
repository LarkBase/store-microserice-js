const logger = require("../config/logger.config");

// Custom Error Handler
const errorHandler = (err, req, res, next) => {
  logger.error(`[${req.method}] ${req.url} - ${err.message}`);

  const statusCode = err.status || 500;
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// 404 Handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
};

module.exports = { errorHandler, notFoundHandler };
