const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');

dotenv.config({ path: './.env' });

const events = [
    {
        title: 'Daily Quiz',
        tag: 'Quiz',
        fee: 10,
        prize: '₹500',
        startTime: '7:00 PM',
        participantsCount: 12,
        status: 'Active',
        config: {
            questions: [
                { question: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], answer: 1 },
                { question: "Which planet is known as the Red Planet?", options: ["Earth", "Venus", "Mars", "Jupiter"], answer: 2 },
                { question: "Which is the largest organ in the human body?", options: ["Lungs", "Brain", "Heart", "Skin"], answer: 3 },
                { question: "Who wrote the Indian National Anthem?", options: ["Rabindranath Tagore", "Bankim Chandra Chattopadhyay", "Mahatma Gandhi", "Subhash Chandra Bose"], answer: 0 },
                { question: "What is the square root of 144?", options: ["10", "11", "12", "13"], answer: 2 }
            ]
        }
    },
    {
        title: 'Lucky Draw',
        tag: 'Draw',
        fee: 15,
        prize: '₹1000',
        startTime: '8:00 PM',
        participantsCount: 8,
        status: 'Active',
        config: {
            prizes: [
                { label: '₹50', coins: 0, cash: 50 },
                { label: '₹200', coins: 0, cash: 200 },
                { label: '₹100', coins: 0, cash: 100 },
                { label: '50 Coins', coins: 50, cash: 0 },
                { label: '₹500', coins: 0, cash: 500 }
            ]
        }
    },
    {
        title: 'Gold Prediction',
        tag: 'Prediction',
        fee: 20,
        prize: '₹2000',
        startTime: 'Live Now',
        participantsCount: 5,
        status: 'Active'
    },
    {
        title: 'Memory Master',
        tag: 'Brain',
        fee: 25,
        prize: '₹1500',
        startTime: 'Live Now',
        participantsCount: 3,
        status: 'Active',
        config: {
            cards: [
                { icon: 'Trophy', color: 'text-amber-500' },
                { icon: 'Zap', color: 'text-blue-500' },
                { icon: 'Heart', color: 'text-rose-500' },
                { icon: 'Star', color: 'text-emerald-500' },
                { icon: 'Ghost', color: 'text-purple-500' },
                { icon: 'Gem', color: 'text-indigo-500' }
            ],
            peekTime: 2.5,
            maxTime: 60
        }
    }
];

const seedEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding events...');

        await Event.deleteMany();
        console.log('Old events cleared.');

        await Event.insertMany(events);
        console.log('Events seeded successfully!');

        process.exit();
    } catch (err) {
        console.error('Error seeding events:', err);
        process.exit(1);
    }
};

seedEvents();
