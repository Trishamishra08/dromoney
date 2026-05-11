const Promotion = require('../models/Promotion');
const User = require('../models/User');
const Task = require('../models/Task');

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

        const oldStatus = promotion.status;
        promotion.status = status;
        if (adminResponse) promotion.adminResponse = adminResponse;
        await promotion.save();

        // If newly approved, automatically spawn a general user earning Task in the DB
        // If status is set to Approved, automatically spawn a general user earning Task in the DB (if not already existing)
        if (status === 'Approved') {
            let targetTitle = 'Sponsored Task';
            let taskType = 'Sponsored';
            let taskCategory = 'Other';
            let taskIcon = 'Monitor';
            let taskConfig = {};

            const cat = promotion.category || 'Custom Task';
            if (cat === 'Instagram Follow') {
                targetTitle = 'Like & Follow Task';
                taskType = 'Sponsored';
                taskCategory = 'Instagram';
                taskIcon = 'Camera';
            } else if (cat === 'YouTube Subscribe') {
                targetTitle = 'Like & Follow Task';
                taskType = 'Sponsored';
                taskCategory = 'YouTube';
                taskIcon = 'Youtube';
            } else if (cat === 'Video Watch') {
                targetTitle = 'Watch and Earn Video';
                taskType = 'Video';
                taskCategory = 'YouTube';
                taskIcon = 'Youtube';
                taskConfig = { timer: '30' };
            } else if (cat === 'Website Visit') {
                targetTitle = 'Sponsored Task';
                taskType = 'Sponsored';
                taskCategory = 'Other';
                taskIcon = 'Monitor';
            } else if (cat === 'App Download') {
                targetTitle = 'Sponsored Task';
                taskType = 'Sponsored';
                taskCategory = 'Other';
                taskIcon = 'Monitor';
            } else if (cat === 'Custom Task') {
                targetTitle = 'Like & Follow Task';
                taskType = 'Sponsored';
                taskCategory = 'Other';
                taskIcon = 'Camera';
            }

            let existingTask = await Task.findOne({ title: targetTitle });
            if (existingTask) {
                existingTask.description = promotion.description || `Complete this ${cat} task to earn coins.`;
                existingTask.link = promotion.brandLink;
                existingTask.category = taskCategory;
                existingTask.icon = taskIcon;
                existingTask.config = taskConfig;
                await existingTask.save();
            } else {
                await Task.create({
                    title: targetTitle,
                    description: promotion.description || `Complete this ${cat} task to earn coins.`,
                    coinsReward: 1,
                    type: taskType,
                    category: taskCategory,
                    link: promotion.brandLink,
                    icon: taskIcon,
                    config: taskConfig,
                    status: 'Active'
                });
            }
        }

        res.json({
            success: true,
            message: `Promotion status updated to ${status}`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
