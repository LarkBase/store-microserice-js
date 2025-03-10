const http = require("http");
const app = require("./app");
const ENV = require("./config/env.config"); 
const logger = require("./config/logger.config");

const PORT = ENV.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`🚀 User-Service running on http://localhost:${PORT} in ${ENV.NODE_ENV} mode`);
});
