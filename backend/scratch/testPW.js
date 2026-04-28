const bcrypt = require('bcryptjs');

const hash = '$2b$10$bE/Z8ueEqxDCj3Ky7dO9B.hJncHSE9DZDWg.EHEQ/umVec9q5hCDS';
const pw = 'admin_password_123';

const test = async () => {
    const isMatch = await bcrypt.compare(pw, hash);
    console.log('Password balance check:', isMatch ? '✅ MATCH' : '❌ NO MATCH');
};

test();
