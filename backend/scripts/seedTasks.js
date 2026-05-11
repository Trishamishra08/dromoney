const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Task = require('../models/Task');
dotenv.config({ path: path.join(__dirname, '../.env') });

const tasks = [
    {
        title: 'trisha mishra',
        description: 'Complete this Video Watch task to earn coins.',
        coinsReward: 1,
        type: 'Video',
        category: 'YouTube',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        icon: 'Youtube',
        status: 'Active',
        config: {
            timer: '30'
        }
    },
    {
        title: 'Visit Website Page',
        description: 'Stay for 15s to earn coins.',
        coinsReward: 1,
        type: 'Web',
        category: 'Other',
        link: 'https://google.com',
        icon: 'Monitor',
        status: 'Active'
    },
    {
        title: 'Watch Video Task',
        description: 'Watch this short video to gain coins.',
        coinsReward: 1,
        type: 'Video',
        category: 'YouTube',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        icon: 'Youtube',
        status: 'Active',
        config: {
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timer: '30'
        }
    },
    {
        title: 'Simple Quiz Task',
        description: 'Answer 1 question correctly.',
        coinsReward: 1,
        type: 'Quiz',
        category: 'Other',
        link: 'https://dromoney.app/quiz',
        icon: 'Lightbulb',
        status: 'Active',
        config: {
            question: 'What is the color of the sky?',
            optA: 'Red',
            optB: 'Blue',
            optC: 'Green',
            optD: 'Yellow',
            answer: 'B'
        }
    },
    {
        title: 'Spin Wheel Task',
        description: 'Try your luck and win coins!',
        coinsReward: 1,
        type: 'Spin',
        category: 'Other',
        link: 'https://dromoney.com/lucky-draw',
        icon: 'Disc',
        status: 'Active'
    },
    {
        title: 'Memory Master',
        description: 'Match emoji pairs in a grid.',
        coinsReward: 1,
        type: 'Memory',
        category: 'Other',
        link: 'https://dromoney.com/memory',
        icon: 'Zap',
        status: 'Active'
    },
    {
        title: 'Treasure Chest',
        description: 'Pick the right box!',
        coinsReward: 1,
        type: 'Treasure',
        category: 'Other',
        link: 'https://dromoney.com/treasure',
        icon: 'Rocket',
        status: 'Active'
    },
    {
        title: 'Speed Tapper',
        description: 'Tap 25 times fast!',
        coinsReward: 1,
        type: 'Tapper',
        category: 'Other',
        link: 'https://dromoney.com/tapper',
        icon: 'Zap',
        status: 'Active'
    },
    {
        title: 'Magic Scratch Card',
        description: 'Rub to reveal hidden coins.',
        coinsReward: 1,
        type: 'Scratch',
        category: 'Other',
        link: 'https://dromoney.com/scratch',
        icon: 'Monitor',
        status: 'Active'
    },
    {
        title: 'Share Platform Task',
        description: 'Share on WhatsApp / Social.',
        coinsReward: 1,
        type: 'Social',
        category: 'WhatsApp',
        link: 'https://dromoney.com',
        icon: 'MessageCircle',
        status: 'Active'
    },
    {
        title: 'Like & Follow Task',
        description: 'Daily Story & Comment: Post a story, add a comment and upload proof.',
        coinsReward: 1,
        type: 'Sponsored',
        category: 'Instagram',
        link: 'https://instagram.com/dromoney',
        icon: 'Camera',
        status: 'Active',
        isDaily: true
    },
    {
        title: 'Watch and Earn Video',
        description: 'Watch the full short video to earn extra coins instantly!',
        coinsReward: 1,
        type: 'Video',
        category: 'YouTube',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        icon: 'Youtube',
        status: 'Active',
        config: {
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timer: '30'
        }
    },
    {
        title: 'Sponsored Task',
        description: 'Download this app daily and upload proof of install/comment.',
        coinsReward: 1,
        type: 'Sponsored',
        category: 'Other',
        link: 'https://whatsapp.com/channel/0029Va9P1725bV8j2g1u4p3u',
        icon: 'Monitor',
        status: 'Active',
        isDaily: true
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
