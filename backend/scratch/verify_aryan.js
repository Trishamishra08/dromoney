const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const verifyAryanToken = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const userId = '69f37796675da2db85e233cb'; 
        const user = await User.findById(userId);

        if (!user) {
            console.log('User Aryan Pathak not found by ID: 69f37796675da2db85e233cb');
        } else {
            console.log(`User Found: ${user.name}`);
            console.log(`FCM Tokens (Web): ${user.fcmTokens?.length || 0}`);
            
            if (user.fcmTokens && user.fcmTokens.length > 0) {
                console.log('✅ Aryan Pathak HAS a token. Ready to send notification.');
            } else {
                console.log('❌ Aryan Pathak DOES NOT have a token in DB.');
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyAryanToken();
