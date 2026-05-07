const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

console.log('--- Terminal Check (Retry) ---');
const adminPath = path.resolve(__dirname, '../config/firebaseAdmin');

try {
    const admin = require(adminPath);
    if (admin.apps.length > 0) {
        console.log('✅ SUCCESS: Firebase Admin is perfectly initialized.');
    } else {
        console.log('❌ FAILED: Firebase Admin apps array is empty.');
    }
} catch (err) {
    console.error('❌ ERROR:', err.message);
}
console.log('--- Check Complete ---');
process.exit();
