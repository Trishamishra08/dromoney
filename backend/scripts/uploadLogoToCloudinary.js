const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const Content = require('../models/Content');
const connectDB = require('../config/db');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const localLogoPath = path.join(__dirname, '../../frontend/src/assets/WhatsApp_Image_2026-04-28_at_10.52.49_PM-removebg-preview.png');

async function uploadAndUpdate() {
    console.log('--- Connecting to Database ---');
    await connectDB();

    try {
        console.log(`--- Uploading local logo file to Cloudinary ---`);
        console.log(`Path: ${localLogoPath}`);

        const uploadResult = await cloudinary.uploader.upload(localLogoPath, {
            folder: 'dromoney',
            public_id: 'brand_logo_main',
            overwrite: true,
            resource_type: 'image'
        });

        console.log(`Successfully uploaded logo! URL: ${uploadResult.secure_url}`);

        console.log('--- Updating Onboarding Course data in MongoDB ---');
        const content = await Content.findOne({ key: 'onboarding_course' });

        if (content) {
            if (!content.data) {
                content.data = {};
            }
            if (!content.data.page2) {
                content.data.page2 = {};
            }
            content.data.page2.logoUrl = uploadResult.secure_url;
            content.markModified('data');
            await content.save();
            console.log('Successfully updated onboarding course brand logo URL in DB!');
        } else {
            console.log('Warning: Onboarding course content document not found in DB.');
        }

    } catch (err) {
        console.error('Error during upload & update:', err);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

uploadAndUpdate();
