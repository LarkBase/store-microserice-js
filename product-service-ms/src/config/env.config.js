// env.js
require('dotenv').config();

const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10),
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW, 10) * 60 * 1000,
};

module.exports = ENV;