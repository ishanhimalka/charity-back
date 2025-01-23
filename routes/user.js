const express = require("express");
const router = express.Router();
const { updateProfile, getUserById } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const upload = require("../middleware/multer");

// Update user profile
router.put("/profile", authenticate, upload.single("profileImage"), updateProfile);

router.get("/:id", authenticate, getUserById);

module.exports = router;
