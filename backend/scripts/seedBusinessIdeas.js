const mongoose = require('mongoose');
const dotenv = require('dotenv');
const BusinessIdea = require('../models/BusinessIdea');

// Load env vars
dotenv.config({ path: './.env' });

const INITIAL_IDEAS = [
    {
        title: "Affiliate Marketing",
        desc: "Start promoting digital products via social media without any investment.",
        potential: "₹10k - ₹30k / mo",
        icon: "TrendingUp",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        type: "Free",
        steps: [
            { title: "Select Niche", text: "Identify high-demand products like tech gadgets, courses, or lifestyle tools." },
            { title: "Sign Up & Link", text: "Join platforms like Amazon Associates or Dromoney's internal affiliate partners." },
            { title: "Content Strategy", text: "Create reels, blogs, or WhatsApp groups to showcase product benefits." },
            { title: "Scale & Earn", text: "Track your sales and optimize conversion with high-converting scripts." }
        ]
    },
    {
        title: "Content Writing",
        desc: "Freelance writing for blogs and companies. Use your language skills.",
        potential: "₹5k - ₹20k / mo",
        icon: "TrendingUp",
        color: "text-blue-500",
        bg: "bg-blue-50",
        type: "Free",
        steps: [
            { title: "Build Portfolio", text: "Write 2-3 sample articles about finance, health, or travel to show clients." },
            { title: "Find Gigs", text: "Use LinkedIn or Dromoney tasks to find legitimate writing opportunities." },
            { title: "Quality Check", text: "Use AI tools to ensure grammar perfection and unique insights." },
            { title: "Direct Outreach", text: "Pitch to small business owners looking to grow their digital presence." }
        ]
    },
    {
        title: "Premium SaaS Agency",
        desc: "Build and sell custom software solutions for local businesses.",
        potential: "₹50k - ₹2L+ / mo",
        icon: "Rocket",
        color: "text-purple-500",
        bg: "bg-purple-50",
        type: "Premium",
        price: 20,
        steps: [
            { title: "Market Analysis", text: "Identify local businesses with poor digital presence (restaurants, gyms, etc.)." },
            { title: "Product Bundling", text: "Offer a website + booking system + WhatsApp automation as a single package." },
            { title: "Outreach Machine", text: "Use cold calling or LinkedIn automation to set up 3-5 demos per week." },
            { title: "Retainer Model", text: "Charge a setup fee (₹20k) and a monthly maintenance fee (₹2k-₹5k)." }
        ]
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing ideas if any
        await BusinessIdea.deleteMany();
        console.log('Cleared existing business ideas.');

        // Insert seed data
        await BusinessIdea.insertMany(INITIAL_IDEAS);
        console.log('Business Ideas seeded successfully!');

        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
