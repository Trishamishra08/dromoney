const express = require('express');
const { register, login, getMe, sendLoginOtp, verifyLoginOtp, sendRegisterOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login); 
router.post('/send-otp', sendLoginOtp); 
router.post('/send-otp-register', sendRegisterOtp);
router.post('/verify-otp', verifyLoginOtp); 
router.get('/me', protect, getMe);

module.exports = router;
