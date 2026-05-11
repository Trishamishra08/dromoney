const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const TaskSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { strict: false });

const Task = mongoose.model('Task', TaskSchema);

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dromoney');
        console.log('Connected to DB');

        const tasksToFix = await Task.find({ createdAt: { $exists: false } });
        console.log(`Found ${tasksToFix.length} tasks with missing createdAt`);

        for (const t of tasksToFix) {
            t.createdAt = new Date();
            await t.save();
            console.log(`Updated task: ${t._id}`);
        }

        console.log('Done fixing tasks!');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

run();
