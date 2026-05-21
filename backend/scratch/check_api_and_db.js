const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const TaskSchema = new mongoose.Schema({
    title: String,
    type: String,
    createdAt: Date
}, { strict: false });

const Task = mongoose.model('Task', TaskSchema);

// Step 1: Hit `/api/public/tasks`
function triggerApi() {
    return new Promise((resolve, reject) => {
        const port = process.env.PORT || 5000;
        console.log(`Sending GET request to http://localhost:${port}/api/public/tasks ...`);
        http.get(`http://localhost:${port}/api/public/tasks`, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${data}`));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Step 2: Verify in DB
async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dromoney');
        console.log('Connected to DB successfully.');

        const count = await Task.countDocuments();
        console.log(`\nTotal tasks now in database: ${count}`);

        const tasks = await Task.find().sort({ createdAt: -1 });
        tasks.forEach((t, idx) => {
            console.log(`[${idx + 1}] Title: "${t.title}" | Type: "${t.type}"`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('DB Check Error:', err);
    }
}

async function run() {
    try {
        const apiResponse = await triggerApi();
        console.log(`API Response Success: ${apiResponse.success}`);
        console.log(`Tasks returned in API response: ${apiResponse.data ? apiResponse.data.length : 0}`);
        
        await checkDb();
    } catch (e) {
        console.error('Run Error:', e.message);
        console.log('\nRetrying DB check directly...');
        await checkDb();
    }
}

run();
