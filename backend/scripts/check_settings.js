const mongoose = require('mongoose');
const Settings = require('../models/Settings');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkSettings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const settings = await Settings.findOne();
        if (!settings) {
            console.log('No settings found');
        } else {
            console.log('--- CURRENT BUSINESS PLANS IN DB ---');
            settings.businessPlans.forEach((plan, i) => {
                console.log(`Plan ${i+1}: ${plan.title}`);
                console.log(`- Price: ₹${plan.price}`);
                console.log(`- Duration: ${plan.duration}`);
                console.log(`- Duration (Days): ${plan.durationInDays}`);
                console.log('---------------------------');
            });
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSettings();
