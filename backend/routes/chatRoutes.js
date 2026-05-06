const express = require('express');
const {
    getMessages,
    sendMessage,
    getAdminChatUsers,
    getAdminUserMessages,
    adminSendMessage,
    renewSupport
} = require('../controllers/chatController');

const router = express.Router();
const { protect, authorize, protectAdmin } = require('../middleware/authMiddleware');

// User routes
router.get('/', protect, getMessages);
router.post('/', protect, sendMessage);
router.post('/renew', protect, renewSupport);

// Admin routes
router.get('/admin/users', protectAdmin, getAdminChatUsers);
router.get('/admin/:userId', protectAdmin, getAdminUserMessages);
router.post('/admin/:userId', protectAdmin, adminSendMessage);

module.exports = router;
