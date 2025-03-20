const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const alertRoutes = require("./src/routes/alert.routes");
const aiRoutes = require("./src/routes/aiResponse.routes");
const docRoutes = require("./src/routes/docs.routes");

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
app.use(aiRoutes);
app.use("/docs", docRoutes);

module.exports = app;
