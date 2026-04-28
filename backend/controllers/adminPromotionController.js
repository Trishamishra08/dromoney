const Promotion = require('../models/Promotion');
const User = require('../models/User');

// @desc    Get all promotion requests
// @route   GET /api/admin/promotions
// @access  Private/Admin
exports.getPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: promotions
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update promotion status and notify user
// @route   PUT /api/admin/promotions/:id
// @access  Private/Admin
exports.updatePromotionStatus = async (req, res) => {
    try {
        const { status, adminResponse } = req.body;
        const promotion = await Promotion.findById(req.params.id);

        if (!promotion) {
            return res.status(404).json({ success: false, message: "Promotion request not found" });
        }

        promotion.status = status;
        if (adminResponse) promotion.adminResponse = adminResponse;
        await promotion.save();

        // In a real app, we'd add a notification to the user's dashboard here.
        // For now, we update the status, and the user's dashboard will fetch the latest status.

        res.json({
            success: true,
            message: `Promotion status updated to ${status}`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
