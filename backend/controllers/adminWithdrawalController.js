const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

// @desc    Get all withdrawal requests
// @route   GET /api/admin/withdrawals
// @access  Private/Admin
exports.getWithdrawals = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status && status !== 'All') {
            query.status = status;
        }

        const withdrawals = await Withdrawal.find(query)
            .populate('user', 'name phone email wallet')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: withdrawals
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update withdrawal status (Approve/Reject)
// @route   PUT /api/admin/withdrawals/:id
// @access  Private/Admin
exports.updateWithdrawalStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {
            return res.status(404).json({ success: false, message: "Withdrawal not found" });
        }

        if (withdrawal.status !== 'Pending') {
            return res.status(400).json({ success: false, message: "Only pending requests can be updated" });
        }

        withdrawal.status = status;
        withdrawal.remarks = remarks;
        withdrawal.processedAt = Date.now();
        await withdrawal.save();

        // If rejected, refund the user? 
        // For now, we assume the withdrawal was created by deducting balance.
        if (status === 'Rejected') {
            const user = await User.findById(withdrawal.user);
            if (user) {
                user.wallet.balance += withdrawal.amount;
                await user.save();
            }
        }

        res.json({
            success: true,
            message: `Withdrawal ${status} successfully`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
