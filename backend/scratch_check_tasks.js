const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    coinsReward: Number,
    type: String,
    category: String,
    link: String,
    icon: String,
    status: String,
    createdAt: Date
});

const Task = mongoose.model('Task', TaskSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dromoney');
        console.log('Connected to DB');

        const tasks = await Task.find({}).sort({ createdAt: -1 });
        console.log(`Total tasks in DB: ${tasks.length}`);
        tasks.forEach((t, idx) => {
            console.log(`\n--- Task ${idx + 1} ---`);
            console.log(`ID: ${t._id}`);
            console.log(`Title: ${t.title}`);
            console.log(`Type: ${t.type}`);
            console.log(`Category: ${t.category}`);
            console.log(`Status: ${t.status}`);
            console.log(`Link: ${t.link}`);
            console.log(`Created: ${t.createdAt}`);
        });

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

check();
