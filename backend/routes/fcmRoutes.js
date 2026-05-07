const express = require('express');
const { saveToken, removeToken, testNotification } = require('../controllers/fcmController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/save', saveToken);
router.post('/remove', removeToken);
router.post('/test', testNotification);

module.exports = router;
