const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        const existingAdmin = await Admin.findOne({ email: 'dromoney@gmail.com' });
        
        if (existingAdmin && process.argv[2] !== '--force') {
            console.log('Admin already exists! Skipping seeding (use --force to update password).');
            process.exit();
        }

        if (existingAdmin && process.argv[2] === '--force') {
            existingAdmin.password = 'dromoney';
            await existingAdmin.save();
            console.log('✅ Admin Password Updated Successfully!');
            process.exit();
        }

        await Admin.create({
            name: 'Super Admin',
            email: 'dromoney@gmail.com',
            password: 'dromoney',
            role: 'Super Admin'
        });

        console.log('✅ Admin User Created Successfully!');
        console.log('Email: dromoney@gmail.com');
        console.log('Password: dromoney');
        
        process.exit();
    } catch (err) {
        console.error('❌ Error Seeding Admin:', err.message);
        process.exit(1);
    }
};

seedAdmin();
