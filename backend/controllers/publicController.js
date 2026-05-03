const Settings = require('../models/Settings');

// @desc    Get Public Settings (Subset of settings for users)
// @route   GET /api/public/settings
// @access  Public
exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne().select('appName referralSystemEnabled referralCommission registrationFee minWithdrawal');
        
        res.status(200).json({
            success: true,
            data: settings || {
                referralCommission: 200,
                referralSystemEnabled: true,
                registrationFee: 499
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
