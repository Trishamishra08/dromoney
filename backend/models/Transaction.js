const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['credit', 'debit', 'withdrawal'],
        required: true,
    },
    currency: {
        type: String,
        enum: ['INR', 'COIN'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    source: {
        type: String,
        required: true, // e.g., 'Task: Ad View', 'Referral Commission', 'Withdrawal'
    },
    status: {
        type: String,
        enum: ['Success', 'Pending', 'Failed'],
        default: 'Success',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
