const Report = require('../models/Report');
const asyncHandler = require('../middleware/async');

// @desc    Submit new problem report
// @route   POST /api/user/data/reports
// @access  Private
exports.submitReport = asyncHandler(async (req, res, next) => {
    const { message } = req.body;

    const report = await Report.create({
        user: req.user.id,
        message
    });

    // Populate user name for the socket event
    const populated = await Report.findById(report._id).populate('user', 'name');

    // Emit real-time notification to all connected admin clients
    if (global.io) {
        global.io.emit('new_report', {
            _id: populated._id,
            userName: populated.user?.name || 'A user',
            message: populated.message,
            createdAt: populated.createdAt
        });
    }

    res.status(201).json({
        success: true,
        data: report
    });
});

// @desc    Get all reports (for admin)
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getAllReports = asyncHandler(async (req, res, next) => {
    const reports = await Report.find()
        .populate('user', 'name profileImage')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
    });
});

// @desc    Update report status
// @route   PATCH /api/admin/reports/:id/status
// @access  Private/Admin
exports.updateReportStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );

    if (!report) {
        return res.status(404).json({ success: false, error: 'Report not found' });
    }

    res.status(200).json({
        success: true,
        data: report
    });
});
