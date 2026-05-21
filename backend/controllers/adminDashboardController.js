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

        // 5. Coins in Market
        const totalCoins = await User.aggregate([
            { $group: { _id: null, total: { $sum: '$coins.balance' } } }
        ]);

        // 6. Active Earners (Users who earned something)
        const activeEarnersCount = await User.countDocuments({ 'wallet.lifetimeEarnings': { $gt: 0 } });

        res.status(200).json({
            success: true,
            data: {
                stats: [
                    { label: 'Active Users', value: activeUsersCount.toLocaleString(), trend: '+12%', color: 'from-sky-500 to-indigo-600' },
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, trend: 'Live', color: 'from-emerald-500 to-teal-600' },
                    { label: 'Coins in Market', value: (totalCoins[0]?.total || 0).toLocaleString(), trend: 'Active', color: 'from-amber-400 to-orange-600' },
                    { label: 'Pending Payouts', value: `₹${(pendingWithdrawals[0]?.total || 0).toLocaleString()}`, trend: `${pendingWithdrawals[0]?.count || 0} new`, color: 'from-rose-500 to-pink-600' }
                ],
                conversionFunnel: [
                    { label: 'Total Visits', value: (activeUsersCount * 5.4).toFixed(0), percent: '100%', color: 'bg-slate-200' },
                    { label: 'Registrations', value: activeUsersCount, percent: `${((activeUsersCount / (activeUsersCount * 5.4)) * 100).toFixed(1)}%`, color: 'bg-indigo-400' },
                    { label: 'Paid Members', value: paidUsersCount, percent: `${((paidUsersCount / (activeUsersCount || 1)) * 100).toFixed(1)}%`, color: 'bg-sky-500' },
                    { label: 'Active Earners', value: activeEarnersCount, percent: `${((activeEarnersCount / (paidUsersCount || 1)) * 100).toFixed(1)}%`, color: 'bg-emerald-500' }
                ]
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Engagement Matrix Data (Daily / Weekly)
// @route   GET /api/admin/dashboard/engagement?period=daily|weekly
// @access  Private (Admin)
exports.getEngagement = async (req, res, next) => {
    try {
        const period = req.query.period === 'weekly' ? 'weekly' : 'daily';
        const now = new Date();
        const labels = [];
        const registrations = [];
        const logins = [];
        const taskCompletions = [];

        const TaskSubmission = require('../models/TaskSubmission');

        if (period === 'daily') {
            // Last 10 days
            for (let i = 9; i >= 0; i--) {
                const dayStart = new Date(now);
                dayStart.setDate(now.getDate() - i);
                dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(dayStart);
                dayEnd.setHours(23, 59, 59, 999);

                const label = dayStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                labels.push(label);

                const regCount = await User.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } });
                registrations.push(regCount);

                const loginCount = await User.countDocuments({ updatedAt: { $gte: dayStart, $lte: dayEnd } });
                logins.push(loginCount);

                const taskCount = await TaskSubmission.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } });
                taskCompletions.push(taskCount);
            }
        } else {
            // Last 8 weeks
            for (let i = 7; i >= 0; i--) {
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - i * 7 - 6);
                weekStart.setHours(0, 0, 0, 0);
                const weekEnd = new Date(now);
                weekEnd.setDate(now.getDate() - i * 7);
                weekEnd.setHours(23, 59, 59, 999);

                const label = `W${8 - i}`;
                labels.push(label);

                const regCount = await User.countDocuments({ createdAt: { $gte: weekStart, $lte: weekEnd } });
                registrations.push(regCount);

                const loginCount = await User.countDocuments({ updatedAt: { $gte: weekStart, $lte: weekEnd } });
                logins.push(loginCount);

                const taskCount = await TaskSubmission.countDocuments({ createdAt: { $gte: weekStart, $lte: weekEnd } });
                taskCompletions.push(taskCount);
            }
        }

        res.status(200).json({
            success: true,
            data: { labels, registrations, logins, taskCompletions }
        });
    } catch (err) {
        next(err);
    }
};
// @route   GET /api/admin/dashboard/alerts
// @access  Private (Admin)
exports.getAlerts = async (req, res, next) => {
    try {
        // 1. Duplicate UPI Detection
        const duplicateUPIs = await Withdrawal.aggregate([
            { $group: { _id: '$upiId', count: { $sum: 1 }, users: { $addToSet: '$user' } } },
            { $match: { count: { $gt: 1 } } },
            { $limit: 3 }
        ]);

        // 2. High Earnings Alert (Users with > ₹5000 in wallet)
        const highEarners = await User.find({ 'wallet.balance': { $gt: 5000 } }).limit(2).select('name phone wallet.balance');

        const alerts = [
            ...duplicateUPIs.map(alert => ({
                user: 'Security Shield',
                reason: `Duplicate UPI (${alert._id}) detected across ${alert.count} accounts`,
                severity: 'high',
                time: 'Just Now'
            })),
            ...highEarners.map(u => ({
                user: u.name,
                reason: `Unusual wallet balance: ₹${u.wallet.balance}. Manual audit required.`,
                severity: 'medium',
                time: 'Active'
            }))
        ];

        res.status(200).json({
            success: true,
            data: alerts
        });
    } catch (err) {
        next(err);
    }
};
