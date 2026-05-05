const User = require('../models/User');
const ReferralTransaction = require('../models/ReferralTransaction');
const Transaction = require('../models/Transaction');
const Settings = require('../models/Settings');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Register user
// @route   POST /api/user/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, referralCode } = req.body;

        // Check if referral code is valid and find referrer
        let referredBy = null;
        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                referredBy = referrer._id;
                
                // Get commission amount from settings
                const settings = await Settings.findOne() || { referralCommission: 200 };
                const commission = settings.referralCommission;

                // Create the user first to get their ID, but we do that below. 
                // Let's hold the referrer object to update after user creation.
                req.referrer = referrer;
                req.commission = commission;
            }
        }

        // Use a default password if none provided (since frontend removed it)
        const userPassword = password || '123456';

        // Create user
        const user = await User.create({
            name,
            email,
            password: userPassword,
            phone,
            referredBy
        });

        // If referredBy, credit the referrer
        if (referredBy && req.referrer) {
            const referrer = req.referrer;
            const commission = req.commission;

            // Update referrer wallet and count
            referrer.wallet.balance += commission;
            referrer.wallet.referralEarnings += commission;
            referrer.referralCount += 1;
            await referrer.save();

            // Create Referral Transaction (for Admin logs)
            await ReferralTransaction.create({
                referrer: referrer._id,
                referredUser: user._id,
                amount: commission,
                status: 'Completed'
            });

            // Create General Transaction (for User history)
            await Transaction.create({
                user: referrer._id,
                type: 'credit',
                currency: 'INR',
                amount: commission,
                source: `Referral Reward: ${user.name}`,
                status: 'Success'
            });
        }

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Send OTP for Login
// @route   POST /api/user/auth/send-otp
// @access  Public
exports.sendLoginOtp = async (req, res, next) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return next(new ErrorResponse('Please provide a phone number', 400));
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return next(new ErrorResponse('No account found with this phone number. Please register.', 404));
        }

        // Generate a 4-digit mock OTP (In production, replace with real SMS gateway)
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Mock sending via saving locally or just return it in response for dev
        console.log(`[OTP] Generated for ${phone}: ${otp}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            dev_otp: otp // Added for easier testing in dev environment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify OTP and Login
// @route   POST /api/user/auth/verify-otp
// @access  Public
exports.verifyLoginOtp = async (req, res, next) => {
    try {
        const { phone, otp, expectedOtp } = req.body;

        if (!phone || !otp) {
            return next(new ErrorResponse('Please provide phone and OTP', 400));
        }

        // Verify OTP - in production this would verify against a DB/Redis cache or SMS service.
        // For development, we match the provided OTP with the dev_otp passed from the frontend.
        if (otp !== expectedOtp && otp !== '1234') { // Fallback '1234' for master OTP
             return next(new ErrorResponse('Invalid OTP', 401));
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user (Legacy fallback for email/password)
// @route   POST /api/user/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isPaid: user.isPaid
        }
    });
};

// @desc    Get current logged in user
// @route   GET /api/user/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};
