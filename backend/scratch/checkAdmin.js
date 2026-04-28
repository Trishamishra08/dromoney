const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await Admin.findOne({ email: 'admin@dromoney.com' }).select('+password');
        if (admin) {
            console.log('✅ Admin found');
            console.log('Email:', admin.email);
            console.log('Hashed Password:', admin.password);
        } else {
            console.log('❌ Admin not found');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
