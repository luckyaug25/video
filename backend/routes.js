const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config();

const router = express.Router();

// PostgreSQL Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },  // Required for NeonDB
});

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Home Page - Show Uploaded Videos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM videos ORDER BY id DESC");
    res.render("index", { videos: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading videos");
  }
});

// Upload Page
router.get("/upload", (req, res) => {
  res.render("upload");
});

// Handle Video Upload
router.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const videoPath = "/uploads/" + req.file.filename;
  try {
    await pool.query("INSERT INTO videos (video_path) VALUES ($1)", [videoPath]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading video");
  }
});

module.exports = router;
