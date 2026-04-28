const Banner = require('../models/Banner');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all marketing banners
// @route   GET /api/admin/banners
// @access  Private/Admin
exports.getBanners = async (req, res, next) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: banners });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new marketing banner
// @route   POST /api/admin/banners
// @access  Private/Admin
exports.createBanner = async (req, res, next) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json({ success: true, data: banner });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a marketing banner
// @route   PUT /api/admin/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res, next) => {
    try {
        let banner = await Banner.findById(req.params.id);

        if (!banner) {
            return next(new ErrorResponse(`Banner not found with id of ${req.params.id}`, 404));
        }

        banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: banner });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a marketing banner
// @route   DELETE /api/admin/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res, next) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return next(new ErrorResponse(`Banner not found with id of ${req.params.id}`, 404));
        }

        await banner.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
