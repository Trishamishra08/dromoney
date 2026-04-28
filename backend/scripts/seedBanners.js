const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '../.env' }); // Adjusted path if running from inside /scripts. Or maybe standard path is needed based on execution directory.

// Let's connect directly with hardcoded check or process.env.MONGO_URI
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/dromoney_db';

const Banner = require('../models/Banner');

const seedBanners = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(uri);

        console.log('MongoDB Connected to Seeder...');

        // Clear existing templates to avoid duplicates (optional, doing it for clean slate)
        await Banner.deleteMany();
        console.log('Cleared existing banners...');

        const bannersData = [
            {
                tag: 'Affiliate Program',
                title: 'Earn ₹200 Per Sale',
                subtitle: 'Share your link & get instant commission on every referral',
                gradient: 'from-sky-500 to-sky-700',
                iconName: 'Users',
                ctaText: 'Invite Now',
                path: '/user/profile',
                isActive: true
            },
            {
                tag: '3X Booster Active',
                title: 'Multiply Your Coins',
                subtitle: 'Upgrade to Monthly Booster and earn 3x coins on every task',
                gradient: 'from-indigo-500 to-indigo-700',
                iconName: 'Zap',
                ctaText: 'Upgrade Now',
                path: '/user/profile',
                isActive: true
            },
            {
                tag: 'Live Contest',
                title: 'Win Up To ₹500',
                subtitle: 'Join the Mega Jackpot Night — limited seats, big rewards!',
                gradient: 'from-emerald-500 to-teal-600',
                iconName: 'Trophy',
                ctaText: 'Join Event',
                path: '/user/events',
                isActive: true
            }
        ];

        await Banner.insertMany(bannersData);

        console.log('Successfully seeded 3 Default Banners to Database!');
        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

seedBanners();
