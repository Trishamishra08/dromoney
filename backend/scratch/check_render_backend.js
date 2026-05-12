const axios = require('axios');

async function run() {
    try {
        console.log('Pinging the live Render server...');
        const res = await axios.get('https://dromoney.onrender.com/api/public/stats', { timeout: 10000 });
        console.log('Ping response code:', res.status);
        console.log('Ping response data:', res.data);
    } catch (err) {
        console.error('Ping failed:', err.response ? { status: err.response.status, data: err.response.data } : err.message);
    }

    try {
        console.log('\nChecking live admin users route metadata...');
        // Let's see if sending an unauthenticated request to the DELETE user endpoint returns 401 (meaning route exists) or 404 (meaning route doesn't exist)
        const res2 = await axios.delete('https://dromoney.onrender.com/api/admin/users/123456789012345678901234');
        console.log('Delete status (unauthenticated):', res2.status);
    } catch (err) {
        if (err.response) {
            console.log('Delete response (unauthenticated):', {
                status: err.response.status,
                data: err.response.data
            });
        } else {
            console.error('Delete check failed:', err.message);
        }
    }
}

run();
