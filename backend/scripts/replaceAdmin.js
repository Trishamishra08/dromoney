const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const replaceAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Delete any admin with old emails
        await Admin.deleteOne({ email: 'admin@dromoney.com' });
        await Admin.deleteOne({ email: 'dromoney@gmail.com' });
        await Admin.deleteOne({ email: 'dromoney12345@gmail.com' });

        await Admin.create({
            name: 'Super Admin',
            email: 'dromoney12345@gmail.com',
            password: 'dro@6363',
            role: 'Super Admin'
        });

        console.log('✅ Admin Replaced Successfully!');
        console.log('New Email: dromoney12345@gmail.com');
        console.log('New Password: dro@6363');
        
        process.exit();
    } catch (err) {
        console.error('❌ Error Replacing Admin:', err.message);
        process.exit(1);
    }
};

replaceAdmin();
