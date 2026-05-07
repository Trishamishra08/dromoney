const mongoose = require('mongoose');
const dotenv = require('dotenv');
const admin = require('../config/firebaseAdmin');
const { sendNotificationToUser } = require('../controllers/fcmController');

dotenv.config();

const sendTestToAryan = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const userId = '69f37796675da2db85e233cb';
        
        console.log('Sending notification to Aryan Pathak...');
        
        const result = await sendNotificationToUser(
            userId,
            'Hello Aryan!',
            'This is a test notification for DroMoney platform.',
            { action: 'test', click_action: 'https://dromoney.com/home' }
        );

        console.log('Result:', result);
        console.log('✅ Notification triggered successfully!');

        process.exit();
    } catch (err) {
        console.error('Error sending notification:', err);
        process.exit(1);
    }
};

sendTestToAryan();
