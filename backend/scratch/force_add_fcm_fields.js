const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const forceUpdateUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const userId = '69e084b34b89a120262c2d5e'; // Chandan Sikarwar ID
        
        // Force update using $set to ensure fields are created in MongoDB
        const result = await User.findByIdAndUpdate(userId, {
            $set: { 
                fcmTokens: ['test_token_web_123'],
                fcmTokenMobile: []
            }
        }, { new: true });

        if (result) {
            console.log('✅ Success! User updated with test tokens.');
            console.log('Fields added:', {
                fcmTokens: result.fcmTokens,
                fcmTokenMobile: result.fcmTokenMobile
            });
            console.log('Now check your MongoDB Compass/Atlas. The fields WILL be there.');
        } else {
            console.log('❌ User not found.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

forceUpdateUser();
