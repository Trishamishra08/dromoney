const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../config/dromoney.json');
const jsonStr = fs.readFileSync(jsonPath, 'utf8');
const b64 = Buffer.from(jsonStr).toString('base64');

console.log('--- BASE64 START ---');
console.log(b64);
console.log('--- BASE64 END ---');
