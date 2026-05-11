const mongoose = require('mongoose');

const TaskSubmissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: mongoose.Schema.ObjectId,
        ref: 'Task',
        required: true
    },
    proofImage: {
        type: String,
        required: true
    },
    coinsReward: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TaskSubmission', TaskSubmissionSchema);
