const mongoose = require('mongoose');

const BusinessIdeaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a business title']
    },
    desc: {
        type: String,
        required: [true, 'Please add a description']
    },
    potential: {
        type: String,
        required: [true, 'Please add earning potential (e.g., ₹10k - ₹30k/mo)']
    },
    icon: {
        type: String,
        default: 'Briefcase'
    },
    color: {
        type: String,
        default: 'text-emerald-500'
    },
    bg: {
        type: String,
        default: 'bg-emerald-50'
    },
    type: {
        type: String,
        enum: ['Free', 'Premium'],
        default: 'Free'
    },
    price: {
        type: Number,
        default: 0 // For premium ideas
    },
    youtubeLink: {
        type: String,
        default: ''
    },
    steps: [{
        title: { type: String, required: true },
        text: { type: String, required: true }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BusinessIdea', BusinessIdeaSchema);
