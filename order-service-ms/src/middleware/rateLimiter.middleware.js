const rateLimit = require("express-rate-limit");
const ENV = require("../config/env.config");

const rateLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW, // Time window in milliseconds
  max: ENV.RATE_LIMIT_MAX, // Max requests per window
  message: {
    status: 429,
    error: "Too many requests. Please try again later.",
  },
  headers: true, // Include rate limit info in headers
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { rateLimiter };
