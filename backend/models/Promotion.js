const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    brandName: {
        type: String,
        required: [true, 'Please add a brand name'],
    },
    brandLink: {
        type: String,
        required: [true, 'Please add a brand link'],
    },
    budget: {
        type: Number,
        required: [true, 'Please add a budget'],
    },
    description: String,
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Rejected', 'Completed'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Promotion', PromotionSchema);
