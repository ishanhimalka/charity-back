const express = require('express');
const router = express.Router();
const { registerUser, loginUser, sendResetOTP, verifyOTP, resetPassword } = require('../controllers/authController');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Reset Password routes
router.post('/password/reset', sendResetOTP);
router.post('/password/verify', verifyOTP);
router.post('/password/change', resetPassword);

module.exports = router;
