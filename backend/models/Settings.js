const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    // General
    appName: {
        type: String,
        default: 'Dromoney'
    },
    contactEmail: {
        type: String,
        default: 'app@dromoney.com'
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    registrationOpen: {
        type: Boolean,
        default: true
    },
    
    // Payments
    adminUpiId: {
        type: String,
        default: 'dromoney@upi'
    },
    bankDetails: {
        type: String,
        default: 'A/C No: 12345678, IFSC: SBIN0001234, Bank: State Bank of India'
    },
    registrationFee: {
        type: Number,
        default: 499
    },
    
    // Earnings
    referralSystemEnabled: {
        type: Boolean,
        default: true
    },
    referralCommission: {
        type: Number,
        default: 200
    },
    coinRate: {
        type: Number,
        default: 0.10
    },
    minWithdrawal: {
        type: Number,
        default: 100
    },
    
    // Future Fund Activity Targets (Admin Configurable)
    futureFundDailyTasksTarget: {
        type: Number,
        default: 10
    },
    futureFundWatchAdTarget: {
        type: Number,
        default: 5
    },
    futureFundEventsTarget: {
        type: Number,
        default: 3
    },
    futureFundBoostersTarget: {
        type: Number,
        default: 1
    },
    futureFundSalesTarget: {
        type: Number,
        default: 10
    },
    futureFundDaysTarget: {
        type: Number,
        default: 7
    },
    
    // Auth (Optional: Primary Admin Credentials override)
    adminEmail: {
        type: String,
        default: 'admin@dromoney.com'
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);
