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
