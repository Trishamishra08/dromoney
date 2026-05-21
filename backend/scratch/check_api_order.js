const http = require('http');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

function triggerApi() {
    return new Promise((resolve, reject) => {
        const port = process.env.PORT || 5000;
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

async function run() {
    try {
        const res = await triggerApi();
        console.log(`API response status: ${res.success}`);
        console.log(`Tasks count: ${res.data.length}\n`);
        
        console.log('--- Tasks in Order of API Response ---');
        res.data.forEach((t, idx) => {
            console.log(`[${idx + 1}] Title: "${t.title}" | Type: "${t.type}" | Coins: ${t.coinsReward || t.reward}`);
        });
    } catch (e) {
        console.error(e);
    }
}

run();
