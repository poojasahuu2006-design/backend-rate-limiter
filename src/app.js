//create the server
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const clientRoutes = require("./routes/client.routes");
const mongoose = require("mongoose");

//middleware
app.use(express.json());

// Swagger Documentation UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint (for Render / uptime monitoring)
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        dbConnected: mongoose.connection.readyState === 1,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Raw Swagger JSON
app.get("/swagger.json", (req, res) => {
    res.json(swaggerDocument);
});

// Root redirects to Swagger UI
app.get("/", (req, res) => {
    res.redirect("/api-docs");
});

// Client routes
app.use("/api/client", clientRoutes);

module.exports = app;