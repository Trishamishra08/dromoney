const Ad = require('../models/Ad');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all active ads
// @route   GET /api/public/ads
// @access  Public (Optional User)
exports.getAds = asyncHandler(async (req, res, next) => {
    const ads = await Ad.find({ status: 'Active' }).sort('-createdAt');
    
    let watchedIds = [];
    if (req.user) {
        const user = await User.findById(req.user.id);
        watchedIds = user.watchedAds.map(id => id.toString());
    }

    const data = ads.map(ad => ({
        ...ad._doc,
        isWatched: watchedIds.includes(ad._id.toString())
    }));

    res.status(200).json({
        success: true,
        count: data.length,
        data
    });
});

// @desc    Get single ad
// @route   GET /api/public/ads/:id
// @access  Public (Optional User)
exports.getAdById = asyncHandler(async (req, res, next) => {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
        return next(new ErrorResponse('Ad not found', 404));
    }

    let isWatched = false;
    if (req.user) {
        const user = await User.findById(req.user.id);
        isWatched = user.watchedAds.includes(ad._id);
    }

    res.status(200).json({
        success: true,
        data: {
            ...ad._doc,
            isWatched
        }
    });
});

// @desc    Reward user for watching an ad
// @route   POST /api/user/data/ads/reward
// @access  Private
exports.rewardUserForAd = asyncHandler(async (req, res, next) => {
    const { adId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // 1. Check if ad exists
    const ad = await Ad.findById(adId);
    if (!ad) {
        return next(new ErrorResponse('Ad not found', 404));
    }

    // 2. Check if already watched
    if (user.watchedAds.includes(adId)) {
        return next(new ErrorResponse('Reward already claimed for this ad', 400));
    }

    // 3. Calculate rewards
    const baseReward = ad.coinsReward || 0;
    const factor = user.isBoosterActive ? 3 : 1;
    const totalAwardedCoins = baseReward * factor;

    // Conversion logic: 1 Coin = ₹0.1
    const coinToRupeeConversion = 0.1;
    const earningsInRupee = parseFloat((totalAwardedCoins * coinToRupeeConversion).toFixed(2));

    // Update User
    user.coins.balance += totalAwardedCoins;
    user.coins.lifetimeCoins += totalAwardedCoins;
    
    // Also update wallet balance (Auto-conversion)
    user.wallet.balance += earningsInRupee;
    user.wallet.lifetimeEarnings += earningsInRupee;
    user.wallet.todayEarnings += earningsInRupee;

    user.watchedAds.push(adId);
    await user.save();

    // 4. Record Transactions
    await Transaction.create({
        user: user._id,
        type: 'credit',
        currency: 'COIN',
        amount: totalAwardedCoins,
        source: `Watched Ad: ${ad.title}`,
        status: 'Success'
    });

    await Transaction.create({
        user: user._id,
        type: 'credit',
        currency: 'INR',
        amount: earningsInRupee,
        source: `Ad Conversion: ${ad.title}`,
        status: 'Success'
    });

    // 5. Update Ad view count
    ad.viewCount += 1;
    await ad.save();

    res.status(200).json({
        success: true,
        message: 'Reward claimed successfully!',
        data: {
            coinsAwarded: totalAwardedCoins,
            inrAwarded: earningsInRupee,
            newCoinBalance: user.coins.balance,
            newWalletBalance: user.wallet.balance
        }
    });
});

// @desc    Create new Ad
// @route   POST /api/admin/ads
// @access  Private/Admin
exports.createAd = asyncHandler(async (req, res, next) => {
    const ad = await Ad.create(req.body);

    res.status(201).json({
        success: true,
        data: ad
    });
});

// @desc    Update Ad
// @route   PUT /api/admin/ads/:id
// @access  Private/Admin
exports.updateAd = asyncHandler(async (req, res, next) => {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!ad) {
        return next(new ErrorResponse('Ad not found', 404));
    }

    res.status(200).json({
        success: true,
        data: ad
    });
});

// @desc    Delete Ad
// @route   DELETE /api/admin/ads/:id
// @access  Private/Admin
exports.deleteAd = asyncHandler(async (req, res, next) => {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
        return next(new ErrorResponse('Ad not found', 404));
    }

    await ad.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get all ads for admin
// @route   GET /api/admin/ads
// @access  Private/Admin
exports.getAdminAds = asyncHandler(async (req, res, next) => {
    const ads = await Ad.find().sort('-createdAt');

    res.status(200).json({
        success: true,
        count: ads.length,
        data: ads
    });
});
