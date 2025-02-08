const express = require("express");
const path = require("path");
const routes = require("./routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Set view engine to EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.static("public"));  // Serve uploaded videos
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/", routes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
