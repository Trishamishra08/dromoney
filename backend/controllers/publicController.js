const Settings = require('../models/Settings');
const User = require('../models/User');

// @desc    Get Public Settings (Subset of settings for users)
// @route   GET /api/public/settings
// @access  Public
exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne().select('appName referralSystemEnabled referralCommission registrationFee minWithdrawal futureFundDailyTasksTarget futureFundWatchAdTarget futureFundEventsTarget futureFundBoostersTarget futureFundSalesTarget futureFundDaysTarget');
        
        res.status(200).json({
            success: true,
            data: settings || {
                referralCommission: 200,
                referralSystemEnabled: true,
                registrationFee: 499,
                futureFundDailyTasksTarget: 10,
                futureFundWatchAdTarget: 5,
                futureFundEventsTarget: 3,
                futureFundBoostersTarget: 1,
                futureFundSalesTarget: 10,
                futureFundDaysTarget: 7
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get Referrer details by referral code
// @route   GET /api/public/referrer/:code
// @access  Public
exports.getReferrerName = async (req, res) => {
    try {
        const { code } = req.params;
        const referrer = await User.findOne({ referralCode: code.toUpperCase() }).select('name');
        if (!referrer) {
            return res.status(404).json({ success: false, message: 'Invalid Referral Code' });
        }
        res.status(200).json({
            success: true,
            name: referrer.name
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
