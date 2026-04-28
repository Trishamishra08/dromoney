const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    type: {
        type: String,
        enum: ['broadcast', 'system', 'reward', 'alert'],
        default: 'broadcast'
    },
    recipients: {
        type: Number,
        default: 0
    },
    targetUrl: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);
