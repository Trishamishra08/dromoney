const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const BusinessIdea = require('../models/BusinessIdea');
const Settings = require('../models/Settings');
const ReferralTransaction = require('../models/ReferralTransaction');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/user/data/razorpay/create-order
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
    const { amount, type, ideaId } = req.body; // amount in INR
    const user = await User.findById(req.user.id);

    let finalAmount = 499; // Default for platform unlock
    let planName = 'Lifetime Access';
    let pType = 'PLATFORM_UNLOCK';

    if (type === 'BUSINESS_IDEA_UNLOCK') {
        const idea = await BusinessIdea.findById(ideaId);
        if (!idea) return next(new ErrorResponse('Business Idea not found', 404));
        if (user.unlockedIdeas.includes(ideaId)) return next(new ErrorResponse('Already unlocked', 400));
        
        finalAmount = idea.price;
        planName = `Unlock: ${idea.title}`;
        pType = 'BUSINESS_IDEA_UNLOCK';
    } else {
        if (user.isPaid) return next(new ErrorResponse('Platform already unlocked.', 400));
    }

    // Create order on Razorpay servers
    const order = await razorpay.orders.create({
        amount: finalAmount * 100, // to paise
        currency: 'INR',
        receipt: `rcpt_${req.user.id.toString().slice(-6)}_${Date.now()}`,
        notes: {
            userId: req.user.id.toString(),
            type: pType,
            ideaId: ideaId || '',
        },
    });

    // Save a pending payment record in DB
    await Payment.create({
        user: req.user.id,
        plan: planName,
        paymentType: pType,
        businessIdea: ideaId || null,
        amount: finalAmount,
        method: 'Razorpay',
        razorpayOrderId: order.id,
        status: 'Pending',
    });

    res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
    });
});

// @desc    Verify Razorpay Payment
// @route   POST /api/user/data/razorpay/verify
// @access  Private
exports.verifyPayment = asyncHandler(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return next(new ErrorResponse('Payment verification data missing', 400));
    }

    // Verify HMAC signature
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (expectedSignature !== razorpay_signature) {
        if (payment) {
            payment.status = 'Failed';
            payment.remarks = 'Signature verification failed';
            await payment.save();
        }
        return next(new ErrorResponse('Payment verification failed. Invalid signature.', 400));
    }

    // ✅ Valid payment — update record and unlock
    if (payment) {
        payment.status = 'Success';
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.processedAt = new Date();
        await payment.save();

        const user = await User.findById(req.user.id);
        if (!user) return next(new ErrorResponse('User not found during unlock', 404));

        if (payment.paymentType === 'BUSINESS_IDEA_UNLOCK' && payment.businessIdea) {
            console.log(`[PAYMENT] Unlocking Business Idea ${payment.businessIdea} for user ${user._id}`);
            // Unlock Business Idea
            if (!user.unlockedIdeas.includes(payment.businessIdea)) {
                user.unlockedIdeas.push(payment.businessIdea);
                await user.save();
            }
        } else {
            console.log(`[PAYMENT] Unlocking Platform for user ${user._id}`);
            
            // Check if this user was referred by someone
            if (user.referredBy && !user.isPaid) {
                try {
                    const settings = await Settings.findOne();
                    const commission = settings ? settings.referralCommission : 200;
                    const referralSystemEnabled = settings ? settings.referralSystemEnabled : true;

                    if (referralSystemEnabled) {
                        const referrer = await User.findById(user.referredBy);
                        if (referrer) {
                            // Update Referrer Wallet
                            referrer.wallet.balance += commission;
                            referrer.wallet.referralEarnings += commission;
                            referrer.wallet.lifetimeEarnings += commission;
                            referrer.referralCount += 1;
                            await referrer.save();

                            // Create Transaction Log
                            await ReferralTransaction.create({
                                referrer: referrer._id,
                                referredUser: user._id,
                                amount: commission,
                                status: 'Completed'
                            });
                            console.log(`[REFERRAL] Credited ₹${commission} to referrer ${referrer._id} for user ${user._id}`);
                        }
                    }
                } catch (refErr) {
                    console.error('[REFERRAL ERROR] Failed to process reward:', refErr.message);
                    // We don't block the main payment success if referral fails
                }
            }

            // Set user isPaid = true (Platform Unlock)
            user.isPaid = true;
            user.unlockedAt = new Date();
            await user.save();
        }
    }

    res.status(200).json({
        success: true,
        message: 'Payment verified successfully!',
    });
});

