const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure the eventimages folder exists
const uploadDir = path.join(__dirname, "../eventimages");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../eventimages");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    },
});

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
};

const uploadEventImages = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter,
});

module.exports = uploadEventImages;
