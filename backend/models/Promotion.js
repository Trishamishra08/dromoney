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
    mobile: {
        type: String,
    },
    whatsapp: {
        type: String,
    },
    category: {
        type: String,
        default: 'Custom Task'
    },
    budget: {
        type: Number,
        required: [true, 'Please add a budget'],
    },
    usersRequired: {
        type: Number,
        default: 0
    },
    description: String,
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Approved', 'Rejected', 'Contacted', 'Completed'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Promotion', PromotionSchema);
