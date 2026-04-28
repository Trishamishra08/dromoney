const Content = require('../models/Content');
const asyncHandler = require('../middleware/async');

const Banner = require('../models/Banner'); // Added Banner model

// @desc    Get dynamic content by key
// @route   GET /api/public/content/:key
// @access  Public
exports.getContent = asyncHandler(async (req, res, next) => {
    const content = await Content.findOne({ key: req.params.key });

    if (!content) {
        return res.status(200).json({
            success: true,
            data: { title: 'Default Title', description: 'Content pending admin setup.' }
        });
    }

    res.status(200).json({
        success: true,
        data: content
    });
});

// @desc    Get dynamic content by multiple keys
// @route   GET /api/public/content/bulk?keys=key1,key2
// @access  Public
exports.getBulkContent = asyncHandler(async (req, res, next) => {
    const keysStr = req.query.keys;
    if (!keysStr) {
        return res.status(200).json({ success: true, data: {} });
    }
    const keys = keysStr.split(',');
    const contents = await Content.find({ key: { $in: keys } });
    
    // Map array to object for easy frontend access
    const results = {};
    contents.forEach(c => {
        results[c.key] = c;
    });

    res.status(200).json({
        success: true,
        data: results
    });
});

// @desc    Get all active marketing banners for users
// @route   GET /api/public/banners
// @access  Public
exports.getActiveBanners = asyncHandler(async (req, res, next) => {
    // Only return banners where isActive is true
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: banners
    });
});

// @desc    Set content (For Admin - simulation)
// @route   POST /api/content
// @access  Private/Admin
exports.updateContent = asyncHandler(async (req, res, next) => {
    const { key, title, description, data } = req.body;

    let content = await Content.findOne({ key });

    if (content) {
        content.title = title;
        content.description = description;
        content.data = data;
        content.lastUpdated = Date.now();
        await content.save();
    } else {
        content = await Content.create({ key, title, description, data });
    }

    res.status(200).json({
        success: true,
        data: content
    });
});
