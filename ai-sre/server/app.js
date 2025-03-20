const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const alertRoutes = require("./src/routes/alert.routes");

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"], 
    allowedHeaders: ["Content-Type"],
  }));
  
app.use(express.json());

// ✅ Register Routes
app.use(alertRoutes);

module.exports = app;
