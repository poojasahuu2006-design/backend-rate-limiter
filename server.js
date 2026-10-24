//start the server
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Start Listening
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});