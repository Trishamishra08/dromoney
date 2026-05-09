const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkMahona = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ phone: '9691967116' });
        if (user) {
            console.log(`User: ${user.name}`);
            console.log(`Created At: ${user.createdAt}`);
            console.log(`Unlocked At: ${user.unlockedAt}`);
            console.log(`supportExpiry: ${user.supportExpiry}`);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkMahona();
