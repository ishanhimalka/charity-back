const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../utils/emailHelper');


// Register a new user
exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Please check the password' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Send OTP
exports.sendResetOTP = async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      // Generate and save OTP
      const otp = generateOTP();
      user.otp = {
          code: otp,
          expiresAt: Date.now() + 10 * 60 * 1000, 
      };

      await user.save();

      // Send OTP email
      await sendOTPEmail(email, otp);
      res.status(200).json({ message: 'Password reset OTP sent to your email.' });
  } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user || !user.otp || !user.otp.code) {
          return res.status(400).json({ error: 'Invalid or expired OTP.' });
      }

      // Check OTP and expiry
      if (user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
          return res.status(400).json({ error: 'Invalid or expired OTP.' });
      }

      res.status(200).json({ message: 'OTP verified. You may now reset your password.' });
  } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      user.otp = null; 

      await user.save();
      res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
