const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ phone: '9575500329' }); // Using the phone number from the test script earlier
        if (!user) {
            console.log('User not found');
        } else {
            console.log('--- USER SUBSCRIPTION DATA ---');
            console.log(`Name: ${user.name}`);
            console.log(`Plan: ${user.activeBusinessPlan}`);
            console.log(`Expiry: ${user.supportExpiry}`);
            console.log(`Current Time: ${new Date()}`);
            
            if (user.supportExpiry) {
                const diff = new Date(user.supportExpiry) - new Date();
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                console.log(`Calculated Remaining: ${days} Days ${hours} Hours`);
            }
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
