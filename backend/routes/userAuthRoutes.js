const express = require('express');
const { register, login, getMe, sendLoginOtp, verifyLoginOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login); // Legacy email/password
router.post('/send-otp', sendLoginOtp); // New Phone OTP send
router.post('/verify-otp', verifyLoginOtp); // New Phone OTP verify
router.get('/me', protect, getMe);

module.exports = router;
