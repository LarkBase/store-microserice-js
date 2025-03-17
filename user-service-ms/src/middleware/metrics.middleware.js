const client = require("prom-client");

// Collect default Node.js metrics
client.collectDefaultMetrics({ timeout: 5000 });

// ✅ HTTP Request Counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// ✅ API Response Time Histogram
const responseTimeHistogram = new client.Histogram({
  name: "http_response_time_seconds",
  help: "Response time per API request",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

// ✅ Fixed: Ensure `login_requests_total` includes labels
const loginCounter = new client.Counter({
  name: "login_requests_total",
  help: "Total number of login requests",
  labelNames: ["method", "route"],
});

// ✅ Fixed: Ensure `login_failures_total` includes labels
const loginFailureCounter = new client.Counter({
  name: "login_failures_total",
  help: "Total number of failed login attempts",
  labelNames: ["method", "route"],
});

// ✅ Use Counter for Login Attempts Per Minute
const loginAttemptsCounter = new client.Counter({
  name: "login_attempts_total",
  help: "Total number of login attempts",
  labelNames: ["method", "route"],
});

// ✅ Middleware to track metrics
const metricsMiddleware = (req, res, next) => {
  console.log(`🔎 Incoming request: ${req.method} ${req.path}`); // ✅ Log all incoming requests

  const startTime = Date.now();

  res.on("finish", () => {
    console.log(`🔎 Metrics Middleware Executed: ${req.method} ${req.path} (originalUrl: ${req.originalUrl})`);
  
    if ((req.path.includes("auth/login") || req.originalUrl.includes("auth/login")) && req.method === "POST") {
      console.log("🚀 Incrementing login_requests_total for:", req.originalUrl);
      loginCounter.inc({ method: req.method, route: req.originalUrl });
    }
  });
  
  next();
};


// ✅ Expose /metrics endpoint for Prometheus
const metricsEndpoint = (app) => {
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  });
};

module.exports = { metricsMiddleware, metricsEndpoint };
