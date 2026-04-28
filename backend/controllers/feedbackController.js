const Feedback = require('../models/Feedback');
const asyncHandler = require('../middleware/async');

// @desc    Submit new feedback
// @route   POST /api/user/data/feedback
// @access  Private
exports.submitFeedback = asyncHandler(async (req, res, next) => {
    const { rating, message } = req.body;

    const feedback = await Feedback.create({
        user: req.user.id,
        rating,
        message
    });

    res.status(201).json({
        success: true,
        data: feedback
    });
});

// @desc    Get all feedbacks (for admin)
// @route   GET /api/admin/feedbacks
// @access  Private/Admin
exports.getAllFeedbacks = asyncHandler(async (req, res, next) => {
    const feedbacks = await Feedback.find()
        .populate('user', 'name profileImage')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: feedbacks.length,
        data: feedbacks
    });
});

// @desc    Mark feedback as read
// @route   PATCH /api/admin/feedbacks/:id/read
// @access  Private/Admin
exports.markAsRead = asyncHandler(async (req, res, next) => {
    const feedback = await Feedback.findByIdAndUpdate(
        req.params.id,
        { status: 'Read' },
        { new: true, runValidators: true }
    );

    if (!feedback) {
        return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    res.status(200).json({
        success: true,
        data: feedback
    });
});
