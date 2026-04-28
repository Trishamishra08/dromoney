const express = require('express');
const { getContent, getBulkContent, getActiveBanners } = require('../controllers/contentController');
const { getBoosters } = require('../controllers/adminBoosterController'); // Reusing controller but for public view (could filter isActive: true)
const { getPublicNotifications } = require('../controllers/notificationController');
const { getBusinessIdeas } = require('../controllers/businessIdeaController');
const { getAds, getAdById } = require('../controllers/adController');
const { getOptionalUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/content/bulk', getBulkContent);
router.get('/content/:key', getContent);
router.get('/banners', getActiveBanners);
router.get('/boosters', getBoosters); // Public view of boosters
router.get('/notifications', getPublicNotifications);
router.get('/business-ideas', getOptionalUser, getBusinessIdeas);
router.get('/ads', getOptionalUser, getAds);
router.get('/ads/:id', getOptionalUser, getAdById);

module.exports = router;
