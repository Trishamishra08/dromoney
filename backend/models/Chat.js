const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    userName: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);
