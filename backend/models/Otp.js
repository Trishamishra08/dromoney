const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 300 } // OTP expires in 5 minutes
    }
});

module.exports = mongoose.model('Otp', OtpSchema);
