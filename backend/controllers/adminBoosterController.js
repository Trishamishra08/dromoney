const Booster = require('../models/Booster');
const asyncHandler = require('../middleware/async');

// @desc    Get all boosters (Admin)
// @route   GET /api/admin/boosters
// @access  Private/Admin
exports.getBoosters = asyncHandler(async (req, res, next) => {
    const boosters = await Booster.find().sort({ price: 1 });
    res.status(200).json({ success: true, data: boosters });
});

// @desc    Create a new booster
// @route   POST /api/admin/boosters
// @access  Private/Admin
exports.createBooster = asyncHandler(async (req, res, next) => {
    const booster = await Booster.create(req.body);
    res.status(201).json({ success: true, data: booster });
});

// @desc    Update a booster
// @route   PUT /api/admin/boosters/:id
// @access  Private/Admin
exports.updateBooster = asyncHandler(async (req, res, next) => {
    let booster = await Booster.findById(req.params.id);

    if (!booster) {
        return res.status(404).json({ success: false, message: 'Booster not found' });
    }

    booster = await Booster.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, data: booster });
});

// @desc    Delete a booster
// @route   DELETE /api/admin/boosters/:id
// @access  Private/Admin
exports.deleteBooster = asyncHandler(async (req, res, next) => {
    const booster = await Booster.findById(req.params.id);

    if (!booster) {
        return res.status(404).json({ success: false, message: 'Booster not found' });
    }

    await booster.deleteOne();
    res.status(200).json({ success: true, data: {} });
});
