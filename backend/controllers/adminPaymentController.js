const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc    Get all membership payments
// @route   GET /api/admin/payments
// @access  Private/Admin
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: payments
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Verify and update payment status
// @route   PUT /api/admin/payments/:id
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        payment.status = status;
        payment.remarks = remarks;
        payment.processedAt = Date.now();
        await payment.save();

        // If success, activate the user
        if (status === 'Success') {
            const user = await User.findById(payment.user);
            if (user) {
                user.isPaid = true;
                await user.save();

                // ── REFERRAL REWARD LOGIC ──
                // Check if user was referred by someone
                if (user.referredBy) {
                    const Settings = require('../models/Settings');
                    const ReferralTransaction = require('../models/ReferralTransaction');
                    
                    const settings = await Settings.findOne();
                    const referrer = await User.findById(user.referredBy);

                    // Conditions: System Enabled, Referrer exists, Referrer is subscribed, Not self-referral
                    if (settings?.referralSystemEnabled && referrer && referrer.isPaid && referrer._id.toString() !== user._id.toString()) {
                        
                        try {
                            // 1. Log Transaction (Unique index on referredUser prevents duplicates)
                            await ReferralTransaction.create({
                                referrer: referrer._id,
                                referredUser: user._id,
                                amount: settings.referralCommission
                            });

                            // 2. Atomic Update of Referrer Wallet
                            await User.findByIdAndUpdate(referrer._id, {
                                $inc: {
                                    'wallet.balance': settings.referralCommission,
                                    'wallet.lifetimeEarnings': settings.referralCommission,
                                    'wallet.referralEarnings': settings.referralCommission,
                                    'referralCount': 1
                                }
                            });

                            console.log(`Referral reward of ₹${settings.referralCommission} credited to ${referrer.name} for ${user.name}`);
                        } catch (err) {
                            // If index unique constraint fails (code 11000), it means reward already given
                            if (err.code === 11000) {
                                console.log('Referral reward already processed for this user');
                            } else {
                                console.error('Referral Reward Error:', err);
                            }
                        }
                    }
                }
            }
        }

        res.json({
            success: true,
            message: `Membership ${status === 'Success' ? 'activated' : 'declined'} successfully`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
