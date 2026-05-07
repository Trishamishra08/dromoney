const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const checkSpecificUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const userId = '69e084b34b89a120262c2d5e';
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found with ID: 69e084b34b89a120262c2d5e');
        } else {
            console.log(`User Found: ${user.name}`);
            console.log(`- fcmTokens: ${JSON.stringify(user.fcmTokens)}`);
            console.log(`- fcmTokenMobile: ${JSON.stringify(user.fcmTokenMobile)}`);
            
            if (user.fcmTokens && user.fcmTokens.length > 0) {
                console.log('✅ Token IS saved in the database.');
            } else {
                console.log('❌ No tokens found for this user in DB.');
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSpecificUser();
