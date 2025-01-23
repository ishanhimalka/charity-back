const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate OTP
const generateOTP = () => {
    return crypto.randomInt(1000, 10000).toString(); 
};

// Send OTP via Email
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP.');
    }
};

module.exports = { generateOTP, sendOTPEmail };

