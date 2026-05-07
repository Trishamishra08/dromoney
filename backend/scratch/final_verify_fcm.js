const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const finalVerifyByName = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Search by name since ID might have different format or be from different cluster
        const user = await User.findOne({ name: /devendra jaiswal/i });

        if (!user) {
            console.log('User not found by name: devendra jaiswal');
            // List some users to see what's in there
            const users = await User.find().limit(5);
            console.log('Recent users in DB:', users.map(u => u.name));
        } else {
            console.log(`User Found: ${user.name} (${user._id})`);
            console.log(`FCM Tokens (Web): ${user.fcmTokens?.length || 0}`);
            console.log(`FCM Tokens (Mobile): ${user.fcmTokenMobile?.length || 0}`);
            
            if (user.fcmTokens && user.fcmTokens.length > 0) {
                console.log('✅ VERIFIED: FCM Token is stored in DB.');
            } else {
                console.log('❌ NOT FOUND: Token is missing from DB.');
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

finalVerifyByName();
