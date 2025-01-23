const fs = require("fs").promises;
const path = require("path");
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Update user profile
exports.updateProfile = async (req, res) => {
  const { fullName, mobile, password,about,location } = req.body;
  const userId = req.user.id; // Get user ID from JWT token
  const profileImage = req.file ? `${req.protocol}://${req.get("host")}/usersprofilepics/${req.file.filename}` : req.body.profileImage;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If a new profile image is uploaded and it differs from the existing one, delete the old image
    if (req.file && user.profileImage && user.profileImage !== profileImage) {
      const oldImagePath = path.join(__dirname, "../usersprofilepics", path.basename(user.profileImage));
      try {
        await fs.access(oldImagePath);
        await fs.unlink(oldImagePath); 
        console.log(`Deleted old profile image: ${oldImagePath}`);
      } catch (err) {
        console.error(`Failed to delete old profile image: ${oldImagePath}`, err.message);
      }
    }

    user.fullName = fullName || user.fullName;
    user.mobile = mobile || user.mobile;
    user.about = about || user.about;
    user.location = location || user.location;

    if (profileImage) {
      user.profileImage = profileImage;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Generate public URL for the profile image
    const imageUrl = `${req.protocol}://${req.get("host")}${user.profileImage}`;
    user.profileImage = imageUrl;

    res.json({ 
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        about: user.about,
        location: user.location,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
      },
    
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("eventsAttended")
            .populate("eventsCreated")
            .populate("eventsAttending");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
