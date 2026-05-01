const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Task = require('../models/Task');
dotenv.config({ path: path.join(__dirname, '../.env') });

const tasks = [
    {
        title: 'Follow us on Instagram',
        description: 'Follow our official Instagram handle to get latest updates',
        coinsReward: 10,
        type: 'Social',
        category: 'Instagram',
        link: 'https://instagram.com/dromoney',
        icon: 'Instagram',
        status: 'Active'
    },
    {
        title: 'Subscribe to YouTube',
        description: 'Watch our latest video and subscribe to our channel',
        coinsReward: 15,
        type: 'Video',
        category: 'YouTube',
        link: 'https://youtube.com/dromoney',
        icon: 'Youtube',
        status: 'Active',
        config: {
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            timer: '60'
        }
    },
    {
        title: 'Join Telegram Channel',
        description: 'Get instant alerts about new events and offers',
        coinsReward: 5,
        type: 'Join',
        category: 'Telegram',
        link: 'https://t.me/dromoney',
        icon: 'MessageCircle',
        status: 'Active'
    },
    {
        title: 'Quick Daily Quiz',
        description: 'Answer a simple question and win coins',
        coinsReward: 20,
        type: 'Quiz',
        category: 'Other',
        link: 'https://dromoney.app/quiz',
        icon: 'Lightbulb',
        status: 'Active',
        config: {
            question: 'What is the primary currency of India?',
            optA: 'Dollar',
            optB: 'Euro',
            optC: 'Rupee',
            optD: 'Yen',
            answer: 'C'
        }
    }
];

const seedTasks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        await Task.deleteMany();
        console.log('Old tasks removed...');

        await Task.insertMany(tasks);
        console.log('Tasks Seeded successfully!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedTasks();
