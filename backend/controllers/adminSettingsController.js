const Settings = require('../models/Settings');
const asyncHandler = require('../middleware/async');

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    // If no settings exist, create default one
    if (!settings) {
        settings = await Settings.create({});
    }

    res.status(200).json({
        success: true,
        data: settings
    });
});

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create(req.body);
    } else {
        settings = await Settings.findOneAndUpdate({}, req.body, {
            new: true,
            runValidators: true
        });
    }

    res.status(200).json({
        success: true,
        data: settings
    });
});
