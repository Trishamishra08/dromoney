const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const Task = require('../models/Task');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
    try {
        // 1. Active Users Count
        const activeUsersCount = await User.countDocuments();
        
        // 2. Total Revenue (Assuming ₹20 per paid user for simulation)
        const paidUsersCount = await User.countDocuments({ isPaid: true });
        const totalRevenue = paidUsersCount * 219; // Price is 219 based on BusinessIdeas context

        // 3. Pending Payouts
        const pendingWithdrawals = await Withdrawal.aggregate([
            { $match: { status: 'Pending' } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        // 4. Verification Queue
        const pendingKycCount = await User.countDocuments({ 'kyc.status': 'Pending' });

        res.status(200).json({
            success: true,
            data: {
                stats: [
                    { label: 'Active Users', value: activeUsersCount.toLocaleString(), trend: '+0%', color: 'from-sky-500 to-indigo-600' },
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, trend: 'Live', color: 'from-emerald-500 to-teal-600' },
                    { label: 'Pending Payouts', value: `₹${(pendingWithdrawals[0]?.total || 0).toLocaleString()}`, trend: `${pendingWithdrawals[0]?.count || 0} new`, color: 'from-rose-500 to-pink-600' },
                    { label: 'KYC Queue', value: pendingKycCount.toLocaleString(), trend: 'Action Needed', color: 'from-amber-400 to-orange-600' }
                ],
                conversionFunnel: [
                    { label: 'Registrations', value: activeUsersCount, percent: '100%', color: 'bg-indigo-400' },
                    { label: 'Paid Members', value: paidUsersCount, percent: `${((paidUsersCount / (activeUsersCount || 1)) * 100).toFixed(1)}%`, color: 'bg-sky-500' }
                ]
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Safety Guard Alerts
// @route   GET /api/admin/dashboard/alerts
// @access  Private (Admin)
exports.getAlerts = async (req, res, next) => {
    try {
        // Simple Fraud Detection Logic: Find users with duplicate UPI IDs
        const duplicateUPIs = await Withdrawal.aggregate([
            { $group: { _id: '$upiId', count: { $sum: 1 }, users: { $addToSet: '$user' } } },
            { $match: { count: { $gt: 1 } } },
            { $limit: 5 }
        ]);

        const alerts = duplicateUPIs.map(alert => ({
            user: 'Multiple Accounts',
            reason: `Duplicate UPI ID detected: ${alert._id}`,
            severity: 'high',
            time: 'Live'
        }));

        res.status(200).json({
            success: true,
            data: alerts
        });
    } catch (err) {
        next(err);
    }
};
