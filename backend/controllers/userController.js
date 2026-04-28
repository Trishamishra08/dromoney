const User = require('../models/User');
const Promotion = require('../models/Promotion');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Update KYC Status and Documents
// @route   PATCH /api/user/data/kyc
// @access  Private
exports.updateKyc = asyncHandler(async (req, res, next) => {
    const { documentNumber } = req.body;
    
    if (!req.file) {
        return next(new ErrorResponse('Please upload your Aadhaar Card image', 400));
    }

    if (!documentNumber) {
        return next(new ErrorResponse('Please provide Aadhaar Number', 400));
    }

    const user = await User.findById(req.user.id);

    // Upload to Cloudinary
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dromoney/kyc',
            public_id: `aadhaar_${user._id}_${Date.now()}`
        });

        user.kyc.documentNumber = documentNumber;
        user.kyc.documentType = 'Aadhaar';
        user.kyc.documentImage = result.secure_url;
        user.kyc.status = 'Pending';
        user.kyc.rejectionReason = ''; // Clear any old rejection

        await user.save();

        res.status(200).json({
            success: true,
            message: 'KYC documents submitted for verification',
            data: {
                status: user.kyc.status,
                documentImage: user.kyc.documentImage
            }
        });
    } catch (err) {
        console.error('Cloudinary Upload Error:', err);
        return next(new ErrorResponse('Failed to upload document. Please try again.', 500));
    }
});

// @desc    Unlock Platform (Payment Simulation)
// @route   POST /api/user/profile/unlock
// @access  Private
exports.unlockPlatform = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    // In production, verify payment gateway response here
    user.isPaid = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Platform unlocked successfully',
        isPaid: user.isPaid
    });
});

// @desc    Submit a Brand Promotion
// @route   POST /api/user/promotions
// @access  Private
exports.submitPromotion = asyncHandler(async (req, res, next) => {
    const { brandName, brandLink, budget, description } = req.body;

    const promotion = await Promotion.create({
        user: req.user.id,
        brandName,
        brandLink,
        budget,
        description
    });

    res.status(201).json({
        success: true,
        data: promotion
    });
});

// @desc    Get user's promotions
// @route   GET /api/user/promotions
// @access  Private
exports.getMyPromotions = asyncHandler(async (req, res, next) => {
    const promotions = await Promotion.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        count: promotions.length,
        data: promotions
    });
});

// @desc    Update Profile Photo
// @route   PATCH /api/user/data/photo
// @access  Private
exports.updateProfilePhoto = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Please upload an image', 400));
    }

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dromoney/profile_pics',
            public_id: `user_${req.user.id}_${Date.now()}`,
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profileImage: result.secure_url },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: user.profileImage
        });
    } catch (err) {
        console.error('Profile Photo Upload Error:', err);
        return next(new ErrorResponse('Failed to upload profile photo', 500));
    }
});
