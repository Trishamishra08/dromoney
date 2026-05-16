const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Content = require('../models/Content');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedIntroVideo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const key = 'platform_intro_video';
        const existing = await Content.findOne({ key });

        const data = {
            isActive: true,
            title: 'Welcome to Dromoney',
            subtitle: 'Watch our guide to start earning today!',
            thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
        };

        if (existing) {
            existing.data = data;
            existing.lastUpdated = Date.now();
            await existing.save();
            console.log('Intro video content updated in DB.');
        } else {
            await Content.create({
                key,
                title: 'Platform Intro Video',
                data
            });
            console.log('Intro video content created in DB.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedIntroVideo();
