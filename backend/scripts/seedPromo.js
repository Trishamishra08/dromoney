const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/dromoney_db';

const Content = require('../models/Content');

const seedPromo = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(uri);
        console.log('MongoDB Connected to Promo Seeder...');

        const promoKey = 'lifetime_promo';
        // Delete old one if exists to keep migration clean
        await Content.deleteOne({ key: promoKey });

        const lifetimePromoData = {
            title: 'Lifetime Access',
            priceTag: '👉 “₹499 buy course \'\' One Time',
            note: 'उसके बाद लाइफ टाइम सर्विस अनलॉक रहेगी ।',
            features: [
                'सभी earning features use कर सकता है',
                'tasks complete कर सकता है',
                'events में भाग ले सकता है'
            ]
        };

        const newPromo = await Content.create({
            key: promoKey,
            title: 'Lifetime Promotion Data',
            description: 'Stores dynamic UI text for the lifetime course promo blocks.',
            data: lifetimePromoData
        });

        console.log('Successfully seeded Lifetime Promo to database!');
        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

seedPromo();
