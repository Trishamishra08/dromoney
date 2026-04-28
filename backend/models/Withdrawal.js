const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add withdrawal amount'],
        min: [100, 'Minimum withdrawal is ₹100']
    },
    paymentMethod: {
        type: String,
        enum: ['UPI', 'Bank Transfer', 'Wallet'],
        default: 'UPI'
    },
    upiId: {
        type: String,
        required: function() { return this.paymentMethod === 'UPI'; }
    },
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        holderName: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Rejected'],
        default: 'Pending'
    },
    rejectionReason: String,
    transactionHash: String, // For proof of payment
    processedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
