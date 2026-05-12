const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('../models/Content');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = {
    key: 'onboarding_course',
    title: 'Dromoney Onboarding Course',
    description: 'A 3-page earning system instruction course with templates and downloadable assets.',
    data: {
        page1: {
            title: '👉 Dromoney से कमाई कैसे करें',
            intro: 'Dromoney एक ऐसा platform है जहाँ आप सीखकर मात्र 15 मिनट मैं earning कर सकते हैं।\n\nयह कोई guaranteed income platform नहीं है — आपकी कमाई आपकी मेहनत ओर कंसिस्टेंसी पर depend करती है।',
            methodsTitle: '💰 कमाई के तरीके:',
            methods: [
                {
                    title: '1. Affiliate Marketing (₹200 per sale)',
                    points: [
                        'आपको एक referral link मिलेगा',
                        'आप उसे share करेंगे',
                        'हर course sale पर ₹200 commission मिलेगा'
                    ]
                },
                {
                    title: '2. Future Fund (Reward System)',
                    points: [
                        'Monetization system (YouTube की तरह)',
                        'criteria : *10 successful sales & *10 दिन active (15 min daily)',
                        '👉 इसके बाद आपको platform से performance-based reward मिलेगा'
                    ]
                },
                {
                    title: '3. Small Tasks + watch Ad = coins 🪙',
                    points: [
                        'छोटे task complete करें',
                        'coins कमाएं',
                        'coins का use events मेंकरें'
                    ]
                },
                {
                    title: '4. Events & Tournament',
                    points: [
                        'coins से participate करें',
                        'prizes जीतें'
                    ]
                },
                {
                    title: '5. Start journey',
                    points: [
                        'नए business ideas देखें',
                        'guidance लेकर खुद का काम शुरू करें'
                    ]
                }
            ]
        },
        page2: {
            title: '👉 Affiliate + Promotion Setup',
            steps: [
                {
                    stepNum: '🔥 Step 1',
                    title: 'Account बनाएं',
                    details: '• Instagram account बनाएं\n• WhatsApp Business use कर सकते हैं\n👉 Username रखें: dromoney_partners ✅'
                },
                {
                    stepNum: '🔥 Step 2',
                    title: 'Bio लगाएं',
                    details: '👉 Ready Bio:\n💰 Online Earning सीखें\n🚀 मेहनत से कमाई शुरू करें\n📲 Simple System | No Experience\n👇 Join Now'
                },
                {
                    stepNum: '🔥 Step 3',
                    title: 'Profile Setup',
                    details: 'Profile photo (logo) लगाएं\nनीचे दिए गए button से logo download करें'
                },
                {
                    stepNum: '🔥 Step 4',
                    title: 'Link Share करें',
                    details: 'अपना referral link copy करें\nInstagram bio / WhatsApp / DM में share करें'
                }
            ],
            templatesTitle: '💎 Ready Templates (Copy-Paste)',
            templates: [
                '💰 Online earning चाहते है? मैंने एक simple platform join किया है जहाँ मैं आपको उसके बारे में बात करके भी रोजाना कमा रहा हूं, आप सीख भी सकते हैं और earn भी कर सकते हैं 👇\n[Your Link]',
                '🚀 आज आपका एक कदम आपको financially फ्री बना सकता है। बिना देर किए 15 मिनट में कमाना शुरू करें। आज ही ज्वाइन करें (golden opportunities) 👇\n[Your Link]',
                '📲 आज के time में online earning सीखना जरूरी है — dromoney से बिना देर किए तुरंत कमाई शुरू करें, यहाँ से 👇\n[Your Link]'
            ],
            step5Title: '🔥 stap 5 : calling kra 🤳',
            step5Details: 'आपको अपनी जान पहचान के दोस्तों वह अपने फॉलोअर्स के साथ-साथ प्लेटफार्म भी आपको रेंडम यूजर्स का data देगा जिन्हें आप कॉल करके अपनी एफिलिएट मार्केटिंग इनकम चालू रख सकते हैं इसके लिए आपको डाटा आपके व्हाट्सएप नंबर पर सेंड किया जाएगा इसी के अलावा आपको कॉल स्क्रिप्ट भी मिलेगी जिसे आप डाउनलोड कर सकते हैं और कॉन्फिडेंस के साथ अगले व्यक्ति को समझा सकते हैं अभी डाउनलोड करें 👇👇',
            callScriptLink: 'https://docs.google.com/document/d/1odnBrnhXwZuDcs_TrJ-LSql0-yB1gMHXaJrM33bo6s0/edit?usp=drivesdk',
            logoUrl: 'https://res.cloudinary.com/dncw1hfix/image/upload/v1778589589/dromoney/brand_logo_main.png'
        },
        page3: {
            title: '👉 रोज क्या करें',
            dailyPlanTitle: '📅 Daily Plan:',
            dailyPlans: [
                'रोज 10–15 लोगों को link share करें',
                '1 sale target रखें = ₹200',
                'daily tasks complete करें',
                'रोज 15 मिनट active रहें'
            ],
            exampleTitle: '📊 Example:',
            examples: [
                '➡️1 sale = ₹200',
                '➡️30 दिन = ₹6000 (example only)'
            ],
            rulesTitle: '⚠️ Important Rules:',
            rules: [
                '1. Income (no guaranteed)',
                '2. मेहनत और consistency जरूरी है',
                '3. Fake account use ना करें',
                '4. सही जानकारी share करें'
            ]
        }
    }
};

const seedOnboardingCourse = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb+srv://dromoney_user:secure_pwd@cluster.mongodb.net/dromoney';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB...');

        await Content.findOneAndUpdate(
            { key: seedData.key },
            seedData,
            { upsert: true, new: true }
        );
        console.log(`Successfully seeded: ${seedData.key}`);

        console.log('Onboarding Course Seeding Completed!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedOnboardingCourse();
