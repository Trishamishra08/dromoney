const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkFullUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ phone: '9575500329' });
        if (!user) {
            console.log('User not found');
        } else {
            console.log(JSON.stringify(user, null, 2));
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkFullUser();
