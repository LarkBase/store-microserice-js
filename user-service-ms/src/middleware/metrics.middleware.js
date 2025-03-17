const client = require("prom-client");

// Collect default Node.js metrics
client.collectDefaultMetrics({ timeout: 5000 });

// HTTP Request Counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// API Response Time Histogram
const responseTimeHistogram = new client.Histogram({
  name: "http_response_time_seconds",
  help: "Response time per API request",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

// Login Request Counter (Used for alerts)
const loginCounter = new client.Counter({
  name: "login_requests_total",
  help: "Total number of login requests",
});

// Failed Login Counter
const loginFailureCounter = new client.Counter({
  name: "login_failures_total",
  help: "Total number of failed login attempts",
});

// ✅ Use Counter Instead of Gauge for Login Attempts Per Minute
const loginAttemptsCounter = new client.Counter({
    name: "login_attempts_total",
    help: "Total number of login attempts",
    labelNames: ["method", "route"],
  });
  

// Middleware to track metrics
const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - startTime) / 1000;

    // Track HTTP request counts
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });

    // Track response time
    responseTimeHistogram.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status: res.statusCode,
      },
      duration
    );

    // ✅ Proper Login Attempt Tracking
    if ((req.path === "/api/auth/login" || req.path === "/login") && req.method === "POST") {
        loginCounter.inc(); // ✅ Ensure this is executed
        if (res.statusCode !== 200) {
          loginFailureCounter.inc();
        }
      
        // ✅ Track login attempts properly
        loginAttemptsCounter.inc({
          method: req.method,
          route: req.path,
        });
      }
      
      
  });

};

// Expose /metrics endpoint for Prometheus
const metricsEndpoint = (app) => {
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  });
};

module.exports = { metricsMiddleware, metricsEndpoint };
