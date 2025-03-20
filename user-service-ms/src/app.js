const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const ENV = require("./config/env.config");
const logger = require("./config/logger.config");
const { rateLimiter } = require("./middleware/rateLimiter.middleware");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");
const { metricsMiddleware, metricsEndpoint } = require("./middleware/metrics.middleware");


// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined", { stream: logger.stream })); // Logging HTTP requests
app.use(rateLimiter);

// Add Prometheus Middleware
app.use(metricsMiddleware);

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const healthRoutes = require("./routes/health.routes");
const adminRoutes = require("./routes/admin.routes");
const failRoutes = require("./routes/fail.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/fail", failRoutes);
app.use("/", healthRoutes);


metricsEndpoint(app);

// 404 Handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

module.exports = app;