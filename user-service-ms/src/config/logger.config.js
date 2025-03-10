const winston = require("winston");
const path = require("path");
const DailyRotateFile = require("winston-daily-rotate-file");
const ENV = require("./env.config");

// Define log file paths
const logDirectory = path.join(__dirname, "../../logs");

// Ensure log directory exists
const fs = require("fs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Define log rotation transport (rotates logs every 15 days)
const rotatingErrorTransport = new DailyRotateFile({
  filename: path.join(logDirectory, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m", // Max file size 20MB
  maxFiles: "15d", // Keep logs for 15 days
  level: "error",
  format: logFormat,
});

const rotatingCombinedTransport = new DailyRotateFile({
  filename: path.join(logDirectory, "combined-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "15d",
  format: logFormat,
});

// Define Winston transports
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    ),
  }),
  rotatingErrorTransport, // Rotated error logs
  rotatingCombinedTransport, // Rotated combined logs
];

// Create the Winston logger instance
const logger = winston.createLogger({
  level: ENV.NODE_ENV === "development" ? "debug" : "info",
  format: logFormat,
  transports,
});

// Stream for Morgan (HTTP request logging)
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger;
