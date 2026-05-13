const User = require('../models/User');
const NotificationLog = require('../models/NotificationLog');
const admin = require('../config/firebaseAdmin');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Save FCM Token
// @route   POST /api/fcm-tokens/save
// @access  Private
exports.saveToken = asyncHandler(async (req, res, next) => {
    const { token, platform } = req.body;

    if (!token) {
        return next(new ErrorResponse('Please provide a token', 400));
    }

    const field = platform === 'mobile' ? 'fcmTokenMobile' : 'fcmTokens';

    // Atomic update using $addToSet to prevent duplicates and parallel save errors
    await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { [field]: token }
    });

    res.status(200).json({
        success: true,
        message: 'Token saved successfully'
    });
});

// @desc    Remove FCM Token
// @route   POST /api/fcm-tokens/remove
// @access  Private
exports.removeToken = asyncHandler(async (req, res, next) => {
    const { token } = req.body;

    // Atomic update using $pull to remove token safely
    await User.findByIdAndUpdate(req.user.id, {
        $pull: { 
            fcmTokens: token,
            fcmTokenMobile: token
        }
    });

    res.status(200).json({
        success: true,
        message: 'Token removed successfully'
    });
});

// @desc    Test Notification
// @route   POST /api/fcm-tokens/test
// @access  Private
exports.testNotification = asyncHandler(async (req, res, next) => {
    const payload = {
        title: 'Payment Confirmed',
        body: 'Payment for Booking\n#BK-1774251474362-607 marked as received.',
        data: {
            type: 'payment',
            id: `payment_${Date.now()}`,
            link: '/user/home'
        }
    };

    await exports.sendNotificationToUser(req.user.id, payload);

    res.status(200).json({
        success: true,
        message: 'Test notification triggered'
    });
});


// Helper Function: Send Notification to User (Duplicate-Safe)
exports.sendNotificationToUser = async (userId, payload) => {
    try {
        // Generate a unique notification ID if not provided
        const notificationId = payload.data?.notificationId || `${userId}_${payload.data?.type || 'gen'}_${Date.now()}`;
        
        // 1. Prevent duplicate delivery (24h window) - Bypass for test
        const isTest = payload.data?.type === 'test';
        const exists = await NotificationLog.findOne({ notificationId });
        if (exists && !isTest) {
            return;
        }

        const user = await User.findById(userId);
        if (!user) return;

        // Combine all tokens
        let tokens = [...(user.fcmTokens || []), ...(user.fcmTokenMobile || [])];
        tokens = [...new Set(tokens)]; // Remove duplicates
        tokens = tokens.filter(t => t && t !== 'undefined' && t !== 'null');

        if (!tokens.length) {
            return;
        }

        // 2. Send via Firebase
        const message = {
            notification: {
                title: payload.title,
                body: payload.body
            },
            data: {
                ...payload.data,
                notificationId
            },
            tokens: tokens
        };

        console.log(`[FCM-DEBUG] Sending to ${tokens.length} tokens for user: ${userId}`);
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`[FCM-DEBUG] Success: ${response.successCount}, Fail: ${response.failureCount}`);
        
        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.log(`[FCM-DEBUG] Token ${idx} Error:`, resp.error.code, resp.error.message);
                }
            });
        }

        // 3. Cleanup invalid tokens if any failed
        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    const errorCode = resp.error.code;
                    if (errorCode === 'messaging/invalid-registration-token' ||
                        errorCode === 'messaging/registration-token-not-registered') {
                        failedTokens.push(tokens[idx]);
                    }
                }
            });

            if (failedTokens.length > 0) {
                user.fcmTokens = user.fcmTokens.filter(t => !failedTokens.includes(t));
                user.fcmTokenMobile = user.fcmTokenMobile.filter(t => !failedTokens.includes(t));
                await user.save();
            }
        }

        // 4. Log the notification
        await NotificationLog.create({
            notificationId,
            userId,
            tokens,
            title: payload.title,
            body: payload.body
        });

    } catch (error) {
        // Silently fail in production
    }
};
