const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let serviceAccount;

// Option A: Load from Base64 (Most Robust)
const configB64 = process.env.FIREBASE_CONFIG_B64 || process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
if (configB64) {
    try {
        const jsonStr = Buffer.from(configB64, 'base64').toString('utf8');
        const parsed = JSON.parse(jsonStr);
        if (parsed.private_key) {
            parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
        }
        serviceAccount = parsed;
        console.log('Firebase Config loaded from Base64');
    } catch (err) {
        console.warn('Firebase Base64 config failed, trying next option...');
    }
}

// Option B: Load from raw JSON string (One-liner)
const configRaw = process.env.FIREBASE_CONFIG || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccount && configRaw) {
    try {
        const parsed = JSON.parse(configRaw);
        if (parsed.private_key) {
            parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
        }
        serviceAccount = parsed;
        console.log('Firebase Config loaded from raw JSON string');
    } catch (err) {
        console.warn('Firebase raw JSON config failed, trying next option...');
    }
}

// Option C: Fallback to file path (Most Reliable)
if (!serviceAccount) {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/dromoney.json';
    const absolutePath = path.resolve(process.cwd(), serviceAccountPath);
    if (fs.existsSync(absolutePath)) {
        try {
            serviceAccount = require(absolutePath);
            console.log('Firebase Config loaded from file:', serviceAccountPath);
        } catch (err) {
            console.warn('Firebase file loading failed.');
        }
    }
}

// Initialize if we found a valid account
if (serviceAccount) {
    try {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('Firebase Admin Initialized successfully');
        }
    } catch (error) {
        console.error('Firebase Initialization Final Error:', error.message);
        // If the parsed credential itself is still bad, we can't do much
    }
} else {
    console.warn('Firebase Admin credentials not found in any source');
}

module.exports = admin;
