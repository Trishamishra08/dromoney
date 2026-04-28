const User = require('../models/User');
const Transaction = require('../models/Transaction');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get user wallet and coin balance
// @route   GET /api/user/wallet/balance
// @access  Private
exports.getBalance = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('wallet coins');

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Add coins and convert to INR automatically
// @route   POST /api/user/wallet/add-coins
// @access  Private
exports.addCoins = asyncHandler(async (req, res, next) => {
    const { amount, source } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Booster logic (3x if active)
    const factor = user.isBoosterActive ? 3 : 1;
    const totalAwardedCoins = amount * factor;

    // Conversion logic: 1 Coin = ₹0.1
    const coinToRupeeConversion = 0.1;
    const earningsInRupee = parseFloat((totalAwardedCoins * coinToRupeeConversion).toFixed(2));

    // Update User
    user.coins.balance += totalAwardedCoins;
    user.coins.lifetimeCoins += totalAwardedCoins;
    user.wallet.balance += earningsInRupee;
    user.wallet.lifetimeEarnings += earningsInRupee;
    user.wallet.todayEarnings += earningsInRupee;

    await user.save();

    // Record Transaction
    await Transaction.create({
        user: user._id,
        type: 'credit',
        currency: 'COIN',
        amount: totalAwardedCoins,
        source: source,
        status: 'Success'
    });

    await Transaction.create({
        user: user._id,
        type: 'credit',
        currency: 'INR',
        amount: earningsInRupee,
        source: `Conversion: ${source}`,
        status: 'Success'
    });

    res.status(200).json({
        success: true,
        data: {
            coinsAwarded: totalAwardedCoins,
            inrCredited: earningsInRupee,
            newWalletBalance: user.wallet.balance,
            newCoinBalance: user.coins.balance
        }
    });
});

// @desc    Request withdrawal
// @route   POST /api/user/wallet/withdraw
// @access  Private
exports.requestWithdrawal = asyncHandler(async (req, res, next) => {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);

    if (user.wallet.balance < amount) {
        return next(new ErrorResponse('Insufficient balance', 400));
    }

    // Deduct from balance
    user.wallet.balance -= amount;
    await user.save();

    // Record Pending Transaction
    const transaction = await Transaction.create({
        user: user._id,
        type: 'withdrawal',
        currency: 'INR',
        amount: amount,
        source: 'Bank Payout',
        status: 'Pending'
    });

    res.status(200).json({
        success: true,
        message: 'Withdrawal request submitted successfully',
        transactionId: transaction._id
    });
});

// @desc    Get transaction history
// @route   GET /api/user/wallet/transactions
// @access  Private
exports.getTransactions = asyncHandler(async (req, res, next) => {
    const transactions = await Transaction.find({ user: req.user.id }).sort('-date');

    res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions
    });
});
