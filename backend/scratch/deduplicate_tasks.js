const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const TaskSchema = new mongoose.Schema({
    title: String
}, { strict: false });

const Task = mongoose.model('Task', TaskSchema);

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dromoney');
        console.log('Connected to DB');

        const tasks = await Task.find();
        console.log(`Total tasks in DB before cleanup: ${tasks.length}`);

        const titlesSeen = new Set();
        let deletedCount = 0;

        for (const t of tasks) {
            if (titlesSeen.has(t.title)) {
                await Task.findByIdAndDelete(t._id);
                console.log(`Deleted duplicate: "${t.title}" (ID: ${t._id})`);
                deletedCount++;
            } else {
                titlesSeen.add(t.title);
            }
        }

        console.log(`Cleanup complete! Deleted ${deletedCount} duplicate tasks.`);
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

run();
