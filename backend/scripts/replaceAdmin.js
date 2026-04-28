const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const replaceAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Delete any admin with old email
        await Admin.deleteOne({ email: 'admin@dromoney.com' });
        
        // Delete any admin with new email to ensure clean seed
        await Admin.deleteOne({ email: 'dromoney@gmail.com' });

        await Admin.create({
            name: 'Super Admin',
            email: 'dromoney@gmail.com',
            password: 'dromoney',
            role: 'Super Admin'
        });

        console.log('✅ Admin Replaced Successfully!');
        console.log('New Email: dromoney@gmail.com');
        console.log('New Password: dromoney');
        
        process.exit();
    } catch (err) {
        console.error('❌ Error Replacing Admin:', err.message);
        process.exit(1);
    }
};

replaceAdmin();
