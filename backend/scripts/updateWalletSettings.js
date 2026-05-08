const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Settings = require('../models/Settings');
const User = require('../models/User');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Ensure minWithdrawal = 100
        let settings = await Settings.findOne();
        if (settings) {
            settings.minWithdrawal = 100;
            await settings.save();
            console.log('✅ minWithdrawal updated to 100');
        } else {
            await Settings.create({ minWithdrawal: 100 });
            console.log('✅ Settings created with minWithdrawal = 100');
        }

        // 2. Update the logged-in user's wallet balance to 205
        const users = await User.find({});
        for (const user of users) {
            user.wallet.balance = 205;
            await user.save();
            console.log(`✅ User "${user.name}" wallet balance set to ₹205`);
        }

        console.log('\n🎉 All updates complete!');
        process.exit();
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

run();
