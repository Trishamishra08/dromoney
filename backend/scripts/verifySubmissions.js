const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Feedback = require('../models/Feedback');
const Report = require('../models/Report');

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const feedbackCount = await Feedback.countDocuments();
        const reportCount = await Report.countDocuments();

        console.log(`Current Feedbacks in DB: ${feedbackCount}`);
        console.log(`Current Problem Reports in DB: ${reportCount}`);

        if (feedbackCount > 0) {
            const lastFeedback = await Feedback.findOne().sort({ createdAt: -1 }).populate('user', 'name');
            console.log('Latest Feedback:', lastFeedback.message, 'by', lastFeedback.user?.name);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
