const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const ENV = require("./config/env.config");
const logger = require("./config/logger.config");
const { rateLimiter } = require("./middleware/rateLimiter.middleware");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");

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

// Routes
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const healthRoutes = require("./routes/health.routes");
const wishlistRoutes = require("./routes/wishlist.routes");

app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/", healthRoutes);
// 404 Handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
