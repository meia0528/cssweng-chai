const multer = require("multer");
const path = require("path");
//const fs = require("fs");

// define the uploads directory
//const uploadDir = path.join(__dirname, "..", "public/images");

// Configure where and how files are stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "/public/images")),
    filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});

// Create multer instance
const upload = multer({ storage });

module.exports = upload;