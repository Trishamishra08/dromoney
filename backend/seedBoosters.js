const mongoose = require('mongoose');
const Booster = require('./models/Booster');
require('dotenv').config();

const INITIAL_BOOSTERS = [
    {
        type: 'support',
        title: '₹11 Support Booster',
        subtitle: 'Boost participation & win more!',
        price: 11,
        benefits: ['2X Winning Chance', 'Priority Event Support', 'Support Badge Profile'],
        isActive: true
    },
    {
        type: 'task',
        title: '₹49 Task Booster',
        subtitle: 'Increase coin value 3X now!',
        price: 49,
        benefits: ['3X Coin Multiplier', 'Instant Task Approval', 'Withdrawal Priority'],
        isActive: true
    }
];

const seedBoosters = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Booster Seeding...');

        // Clear existing
        await Booster.deleteMany({ type: { $in: ['support', 'task'] } });

        // Insert new
        await Booster.insertMany(INITIAL_BOOSTERS);

        console.log('✔ Initial Boosters Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedBoosters();
