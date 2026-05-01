const mongoose = require('mongoose');

const EventParticipantSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number
    },
    result: {
        type: String
    },
    prize: {
        type: String
    },
    prizeStatus: {
        type: String,
        enum: ['Pending', 'Awarded', 'Rejected'],
        default: 'Pending'
    },
    prizeNote: {
        type: String
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure a user can join an event only once per day (optional, but good for Dromoney logic)
// For now, let's just allow unique event-user pairs or handle it in controller.

module.exports = mongoose.model('EventParticipant', EventParticipantSchema);
