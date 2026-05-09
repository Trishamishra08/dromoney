const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkFullPayment = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const p = await Payment.findOne({ plan: 'Test', status: 'Success' }).sort({ createdAt: -1 });
        if (p) {
            console.log(JSON.stringify(p, null, 2));
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkFullPayment();
