const User = require('../models/User');
const Promotion = require('../models/Promotion');
const Settings = require('../models/Settings');
const ReferralTransaction = require('../models/ReferralTransaction');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

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
    console.log('--- KYC Submission Started ---');
    const { documentNumber } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Prevent resubmission if already Approved/Verified
    if (user.kyc?.status === 'Approved' || user.kyc?.status === 'Verified') {
        return res.status(200).json({
            success: true,
            message: 'KYC already approved'
        });
    }

    if (!req.file) {
        return next(new ErrorResponse('Please upload your Aadhaar Card image', 400));
    }

    if (!documentNumber) {
        return next(new ErrorResponse('Please provide Aadhaar Number', 400));
    }

    // Upload to Cloudinary
    try {
        console.log('Uploading KYC document for user:', user._id);
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dromoney/kyc',
            public_id: `aadhaar_${user._id}_${Date.now()}`
        });
        
        // Update user KYC data
        user.kyc = {
            status: 'Pending',
            documentType: 'Aadhaar',
            documentNumber: documentNumber,
            documentImage: result.secure_url,
            rejectionReason: ''
        };

        // Explicitly mark as modified for Mongoose
        user.markModified('kyc');
        await user.save();
        
        // Cleanup local file
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(200).json({
            success: true,
            message: 'KYC documents submitted for verification',
            data: {
                status: user.kyc.status,
                documentImage: user.kyc.documentImage
            }
        });
    } catch (err) {
        console.error('KYC FINAL UPLOAD ERROR:', err.message);
        // Cleanup local file on error
        if (req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return next(new ErrorResponse('Failed to upload document. Please try again.', 500));
    }
});

// @desc    Unlock Platform (Payment Simulation)
// @route   POST /api/user/profile/unlock
// @access  Private
exports.unlockPlatform = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    // In production, verify payment gateway response here
    
    // Check for referral reward
    if (user.referredBy && !user.isPaid) {
        try {
            const settings = await Settings.findOne();
            const commission = settings ? settings.referralCommission : 200;
            if (settings && settings.referralSystemEnabled) {
                const referrer = await User.findById(user.referredBy);
                if (referrer) {
                    referrer.wallet.balance += commission;
                    referrer.wallet.referralEarnings += commission;
                    referrer.wallet.lifetimeEarnings += commission;
                    referrer.referralCount += 1;
                    await referrer.save();

                    await ReferralTransaction.create({
                        referrer: referrer._id,
                        referredUser: user._id,
                        amount: commission,
                        status: 'Completed'
                    });
                }
            }
        } catch (err) {
            console.error('Simulation Referral Error:', err.message);
        }
    }

    user.isPaid = true;
    user.unlockedAt = new Date();
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

    // Upload to Cloudinary
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

        // Cleanup local file
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(200).json({
            success: true,
            data: user.profileImage
        });
    } catch (err) {
        console.error('Profile Photo Upload Error:', err);
        // Cleanup local file on error
        if (req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return next(new ErrorResponse('Failed to upload profile photo', 500));
    }
});

// @desc    Update Future Fund Progress
// @route   POST /api/user/data/future-fund/progress
// @access  Private
exports.updateFutureFundProgress = asyncHandler(async (req, res, next) => {
    const { type, value } = req.body; // type: 'sales', 'activity', 'days'
    const user = await User.findById(req.user.id);

    if (!user.futureFund) {
        user.futureFund = { progress: 0, criteria: [] };
    }

    // Initialize default criteria if empty
    if (!user.futureFund.criteria || user.futureFund.criteria.length === 0) {
        user.futureFund.criteria = [
            { id: 1, title: 'Successful Sales', target: 10, current: 0, completed: false },
            { id: 2, title: 'Daily Activity', target: 15, current: 0, completed: false },
            { id: 3, title: 'Active Days', target: 7, current: 0, completed: false }
        ];
    }

    const criterion = user.futureFund.criteria.find(c => {
        if (type === 'sales' && c.id === 1) return true;
        if (type === 'activity' && c.id === 2) return true;
        if (type === 'days' && c.id === 3) return true;
        return false;
    });

    if (criterion) {
        if (type === 'activity') {
            criterion.current += value; // value is minutes to add
        } else if (type === 'sales') {
            criterion.current += value; // add successful sales
        } else if (type === 'days') {
            criterion.current = value; // set total active days
        }

        if (criterion.current >= criterion.target) {
            criterion.completed = true;
        }
    }

    // Recalculate total progress
    const totalCriteria = user.futureFund.criteria.length;
    let completedWeight = 0;

    user.futureFund.criteria.forEach(c => {
        // Simple weight: each criterion contributes equally to the 100%
        const ratio = Math.min(c.current / c.target, 1);
        completedWeight += ratio;
    });

    user.futureFund.progress = Math.round((completedWeight / totalCriteria) * 100);

    await user.save();

    res.status(200).json({
        success: true,
        data: user.futureFund
    });
});
// @desc    Unlock Future Fund
// @route   POST /api/user/data/future-fund/unlock
// @access  Private
exports.unlockFutureFund = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (user.futureFund.progress < 100) {
        return next(new ErrorResponse('Please complete all criteria first', 400));
    }

    // Mark as unlocked/active
    // You could add a status field to the model if needed, but for now we just return success
    // user.futureFund.status = 'active'; 
    // await user.save();

    res.status(200).json({
        success: true,
        message: 'Future Fund unlocked'
    });
});
