const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
    try {
        const { search, status } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        if (status && status !== 'All') {
            // Need a 'status' field in User model or map here
            // Currently User has isPaid, but not 'Blocked'
            // I'll add 'isBlocked' to User Schema later if needed, but for now I'll use logic
        }

        const users = await User.find(query).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Manage KYC
// @route   PUT /api/admin/users/:id/kyc
// @access  Private (Admin)
exports.manageKYC = async (req, res, next) => {
    try {
        const { status, rejectionReason } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        user.kyc.status = status;
        if (rejectionReason) user.kyc.rejectionReason = rejectionReason;

        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all users with Pending KYC
// @route   GET /api/admin/kyc/pending
// @access  Private (Admin)
exports.getPendingKyc = async (req, res, next) => {
    try {
        const users = await User.find({ 'kyc.status': { $in: ['Pending', 'pending'] } }).sort('-createdAt');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Block/Unblock User
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin)
exports.toggleBlock = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // We need 'isBlocked' in User Schema. I'll add it in the next step.
        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'} successfully`
        });
    } catch (err) {
        next(err);
    }
};
