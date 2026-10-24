const mongoose = require("mongoose");

async function connectDB() {
    try {
        if (!process.env.MONGO_URI) {
            console.warn("⚠️ Warning: MONGO_URI environment variable is not defined. Please set it in your environment or .env file.");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Server is connected to the DB successfully");
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
}

module.exports = connectDB;