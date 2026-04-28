const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true, // e.g., 'income_projects', 'business_ideas_free'
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    data: mongoose.Schema.Types.Mixed, // flexible for lists or single objects
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Content', ContentSchema);
