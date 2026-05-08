const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const { sendNotificationToUser } = require('./fcmController');

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

        const user = await User.findById(withdrawal.user);
        if (!user) {
            return res.status(404).json({ success: false, message: "User associated with this withdrawal not found" });
        }

        const totalDeduction = withdrawal.amount + 5;

        // Balance Check & Deduction first if Approved
        if (status === 'Approved') {
            if (user.wallet.balance < totalDeduction) {
                return res.status(400).json({ success: false, message: `User has insufficient balance (₹${user.wallet.balance}) for this withdrawal of ₹${withdrawal.amount} with ₹5 transaction fee.` });
            }
            user.wallet.balance -= totalDeduction;
            
            // Add in-app notification
            user.notifications = user.notifications || [];
            user.notifications.push({
                title: "Withdrawal Approved",
                message: `Your withdrawal of ₹${withdrawal.amount} has been approved. ₹${totalDeduction} deducted from wallet.`,
                type: "success",
                date: new Date()
            });
            await user.save();
        }

        // Handle Rejected notifications
        if (status === 'Rejected') {
            user.notifications = user.notifications || [];
            user.notifications.push({
                title: "Withdrawal Rejected",
                message: `Your withdrawal request for ₹${withdrawal.amount} was rejected.`,
                type: "error",
                date: new Date()
            });
            await user.save();
        }

        // Save withdrawal status
        withdrawal.status = status;
        withdrawal.remarks = remarks;
        withdrawal.processedAt = Date.now();
        await withdrawal.save();

        // Update corresponding Transaction status
        const Transaction = require('../models/Transaction');
        if (withdrawal.transaction) {
            const tx = await Transaction.findById(withdrawal.transaction);
            if (tx) {
                tx.status = status === 'Approved' ? 'Success' : status === 'Rejected' ? 'Failed' : 'Pending';
                await tx.save();
            }
        }

        // Update corresponding Fee Transaction status
        if (withdrawal.feeTransaction) {
            const feeTx = await Transaction.findById(withdrawal.feeTransaction);
            if (feeTx) {
                feeTx.status = status === 'Approved' ? 'Success' : status === 'Rejected' ? 'Failed' : 'Pending';
                await feeTx.save();
            }
        } else {
            // Fallback for old withdrawal requests that didn't have feeTransaction saved
            const feeTx = await Transaction.findOne({
                user: withdrawal.user,
                type: 'withdrawal',
                amount: 5,
                source: 'Withdrawal Transaction Fee',
                status: 'Pending'
            });
            if (feeTx) {
                feeTx.status = status === 'Approved' ? 'Success' : status === 'Rejected' ? 'Failed' : 'Pending';
                await feeTx.save();
            }
        }

        // Send Push Notification
        if (status === 'Approved' || status === 'Rejected') {
            await sendNotificationToUser(withdrawal.user, {
                title: `Withdrawal ${status}`,
                body: `Your withdrawal request for ₹${withdrawal.amount} has been ${status.toLowerCase()}.${remarks ? ' ' + remarks : ''}`,
                data: {
                    type: 'withdrawal',
                    link: '/user/wallet'
                }
            });
        }

        // Emit real-time Socket event to notify user's frontend
        if (global.io) {
            global.io.emit(`withdrawal_update_${withdrawal.user}`, {
                status: status
            });
        }

        res.json({
            success: true,
            message: `Withdrawal ${status} successfully`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
