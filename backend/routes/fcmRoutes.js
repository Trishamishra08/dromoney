const express = require('express');
const { saveToken, removeToken, testNotification } = require('../controllers/fcmController');

const router = express.Router();

// A dynamic middleware to try user authentication first, then admin authentication
const protectUserOrAdmin = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try user first
        const User = require('../models/User');
        let user = await User.findById(decoded.id);
        if (user) {
            req.user = user;
            return next();
        }

        // Try admin
        const Admin = require('../models/Admin');
        let admin = await Admin.findById(decoded.id);
        if (admin) {
            req.admin = admin;
            return next();
        }

        return res.status(401).json({ success: false, message: 'Not authorized' });
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
};

router.use(protectUserOrAdmin);

router.post('/save', saveToken);
router.post('/remove', removeToken);
router.post('/test', testNotification);

module.exports = router;
