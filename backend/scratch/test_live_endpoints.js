const axios = require('axios');

async function check(url, method = 'get', data = null) {
    try {
        console.log(`\nProbing [${method.toUpperCase()}] ${url}...`);
        const res = await axios({ method, url, data, timeout: 10000 });
        console.log(`Response [${res.status}]:`, res.data);
    } catch (err) {
        console.log(`Error [${err.response ? err.response.status : 'No Response'}]:`, err.response ? err.response.data : err.message);
    }
}

async function run() {
    await check('https://dromoney.onrender.com/api/admin/users');
    await check('https://dromoney.onrender.com/api/admin/users/123456789012345678901234', 'delete');
}

run();
