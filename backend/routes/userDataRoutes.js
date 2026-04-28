const express = require('express');
const { 
    updateKyc, 
    unlockPlatform, 
    submitPromotion, 
    getMyPromotions, 
    updateProfilePhoto 
} = require('../controllers/userController');
const { unlockIdea } = require('../controllers/businessIdeaController');
const { createOrder, verifyPayment } = require('../controllers/razorpayController');
const { rewardUserForAd } = require('../controllers/adController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect); // Secure all routes

const { submitFeedback } = require('../controllers/feedbackController');
const { submitReport } = require('../controllers/reportController');

router.patch('/kyc', upload.single('document'), updateKyc);
router.post('/unlock', unlockPlatform);
router.post('/promotions', submitPromotion);
router.get('/promotions', getMyPromotions);
router.patch('/photo', upload.single('photo'), updateProfilePhoto);
router.post('/feedback', submitFeedback);
router.post('/reports', submitReport);
router.post('/business-ideas/unlock', unlockIdea);
router.post('/ads/reward', rewardUserForAd);

// Razorpay Routes
router.post('/razorpay/create-order', createOrder);
router.post('/razorpay/verify', verifyPayment);

module.exports = router;


