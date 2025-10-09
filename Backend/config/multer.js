const multer = require("multer");
const path = require("path");
const fs = require("fs");

// define the uploads directory
const uploadDir = path.join(__dirname, "..", "uploads");

// create the folder if it doesn’t exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure where and how files are stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// Create multer instance
const upload = multer({ storage });

module.exports = upload;
