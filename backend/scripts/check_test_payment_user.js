const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkTestPaymentUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const p = await Payment.findOne({ plan: 'Test', status: 'Success' }).sort({ createdAt: -1 });
        if (p) {
            console.log(`Payment User ID: ${p.user}`);
            console.log(`Payment Date: ${p.createdAt}`);
            
            const User = require('../models/User');
            const user = await User.findById(p.user);
            if (user) {
                console.log(`User Name: ${user.name}`);
                console.log(`User Phone: ${user.phone}`);
                console.log(`User supportExpiry: ${user.supportExpiry}`);
            }
        } else {
            console.log('No successful Test payment found');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkTestPaymentUser();
