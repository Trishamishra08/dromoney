const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkRenewalPayments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const p = await Payment.findOne({ paymentType: 'SUPPORT_CHAT_RENEWAL', status: 'Success' }).sort({ createdAt: -1 });
        if (p) {
            console.log(`Renewal Payment Found!`);
            console.log(`User ID: ${p.user}`);
            console.log(`Date: ${p.createdAt}`);
            console.log(`Duration (Days): ${p.durationInDays}`);
        } else {
            console.log('No successful Renewal payment found');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkRenewalPayments();
