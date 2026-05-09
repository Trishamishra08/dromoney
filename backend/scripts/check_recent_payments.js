const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkPayments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const payments = await Payment.find({ status: 'Success' }).sort({ createdAt: -1 }).limit(5);
        console.log('--- RECENT SUCCESSFUL PAYMENTS ---');
        payments.forEach(p => {
            console.log(`Plan: ${p.plan}`);
            console.log(`Type: ${p.paymentType}`);
            console.log(`Duration (Days): ${p.durationInDays}`);
            console.log(`Amount: ₹${p.amount}`);
            console.log(`Date: ${p.createdAt}`);
            console.log('---------------------------');
        });
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkPayments();
