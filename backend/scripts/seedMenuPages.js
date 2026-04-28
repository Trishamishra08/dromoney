const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/dromoney_db';

const Content = require('../models/Content');

const DEFAULT_CONTENT = {
    'how-it-works': {
        title: 'How It Works',
        subtitle: 'Master the Dromoney Platform',
        sections: [
            { title: '1. Register & Verify', text: 'Create your account and complete a simple KYC to unlock all earning features safely.' },
            { title: '2. Explore Opportunities', text: 'Browse through affiliate projects, daily tasks, and exclusive business ideas tailored for you.' },
            { title: '3. Start Earning', text: 'Complete tasks or refer partners to accumulate coins and real cash in your dashboard.' },
            { title: '4. Instant Payouts', text: 'Withdraw your earnings directly to your bank account with our secure payment gateway.' }
        ]
    },
    'benefits': {
        title: 'User Benefits',
        subtitle: 'Why choose Dromoney?',
        sections: [
            { title: 'Financial Freedom', text: 'Access multiple income streams that you can manage from anywhere in the world.' },
            { title: 'Skill Development', text: 'Learn marketing and business strategies through our verified project frameworks.' },
            { title: 'Safe & Secure', text: 'Your data and earnings are protected by industry-leading security protocols.' },
            { title: 'Community Support', text: 'Join thousands of earners and get 24/7 assistance from our expert team.' }
        ]
    },
    'support': {
        title: 'Support Center',
        subtitle: 'We are here to help you 24/7',
        sections: [
            { title: 'Direct Assistance', text: 'Chat with our support executives for any technical or payment related queries.' },
            { title: 'Knowledge Base', text: 'Read our guides and FAQs to solve common issues instantly without waiting.' },
            { title: 'Email Support', text: 'For complex issues, reach us at support@dromoney.com for detailed resolutions.' }
        ]
    },
    'about': {
        title: 'About Dromoney',
        subtitle: 'Empowering Digital Earners',
        sections: [
            { title: 'Our Mission', text: 'To provide a transparent and efficient platform where everyone can monetize their digital presence.' },
            { title: 'The Platform', text: 'Dromoney is India\'s fastest growing affiliate and task-based earning ecosystem.' },
            { title: 'Transparency', text: 'We believe in fairness. Every payout and task is tracked with 100% precision.' }
        ]
    },
    'privacy': {
        title: 'Privacy Policy',
        subtitle: 'Your Data Privacy',
        sections: [
            { title: 'Information Collection', text: 'We collect only necessary information like name and phone for account security.' },
            { title: 'Data Security', text: 'Your data is encrypted and stored in secure cloud servers.' }
        ]
    },
    'terms': {
        title: 'Terms & Conditions',
        subtitle: 'Usage Guidelines',
        sections: [
            { title: 'Account Creation', text: 'Users must provide accurate information during registration.' },
            { title: 'Eligibility', text: 'The platform is for individuals looking to earn through verified task models.' }
        ]
    },
    'guidelines': {
        title: 'User Guidelines',
        subtitle: 'Community Standards',
        sections: [
            { title: 'Ethical Earning', text: 'Always follow task instructions precisely to ensure coin credit.' },
            { title: 'Respect', text: 'Maintain professional conduct in all platform community interactions.' }
        ]
    },
    'boosters': {
        title: 'Booster Packs Config',
        description: 'Dynamic text for booster purchase cards',
        data: {
            support: {
                title: '₹11 Support Booster',
                subtitle: 'Boost participation & win more!',
                benefits: ['2X Winning Chance', 'Priority Event Support', 'Support Badge Profile']
            },
            task: {
                title: '₹49 Task Booster',
                subtitle: 'Increase coin value 3X now!',
                benefits: ['3X Coin Multiplier', 'Instant Task Approval', 'Withdrawal Priority']
            }
        }
    },
    'future_features': {
        title: 'Future and Option',
        description: 'Upcoming earning opportunities',
        data: [
            { title: 'Dromoney Marketplace', text: 'Buy and sell digital assets directly within our ecosystem using wallet balance.' },
            { title: 'Global Payouts', text: 'Expansion beyond local banking to support international earners through crypto and PayPal.' },
            { title: 'Advanced AI Tools', text: 'Get automated marketing kits generated for your affiliate links for 10x better results.' }
        ]
    },
    'income_projects': {
        title: 'Drowmoney Projects',
        description: 'Access exclusive high-ticket affiliate projects and scale your monthly income with verified partners.',
        data: {
            title: 'Drowmoney Projects',
            description: 'Access exclusive high-ticket affiliate projects and scale your monthly income with verified partners.'
        }
    },
    'layout_refer': {
        title: 'Referral System',
        description: 'EARN ₹200 REWARD',
        data: {
            headline: 'EARN ₹200 REWARD',
            steps: [
                { title: 'SHARE YOUR LINK', desc: 'अपना referral link दोस्तों के साथ share करें।' },
                { title: 'EARN ₹200 INSTANT', desc: 'हर सफल registration पर आपको ₹200 का instant reward मिलेगा।' },
                { title: 'DIRECT WALLET CREDIT', desc: 'आपका reward amount सीधे आपके wallet में add कर दिया जायेगा।' }
            ]
        }
    },
    'layout_tasks': {
        title: 'Daily Tasks',
        description: 'COLLECT REWARD COINS',
        data: {
            headline: 'COLLECT REWARD COINS',
            steps: [
                { title: 'COMPLETE TASKS', desc: 'रोजाना simple tasks को पूरा करें और reward coins earn करें।' },
                { title: 'REDEEM FOR CASH', desc: 'इन coins को आप बाद में real cash में convert kar sakte hain।' },
                { title: '3X Booster Benefit', desc: 'Booster active karke aap apni coin earnings ko 3X tak badha sakte hain.' }
            ]
        }
    },
    'layout_fund': {
        title: 'Future Fund',
        description: 'PASSIVE INCOME SECURITY',
        data: {
            headline: 'PASSIVE INCOME SECURITY',
            steps: [
                { title: 'PLATFORM STAKE', desc: 'एक बार eligible होने पर, आपको platform के profits में हिस्सा मिलेगा।' },
                { title: 'MONTHLY PAYOUTS', desc: 'Profit share har mahine aapke wallet mein auto-credit hoga.' },
                { title: 'LONG TERM GROWTH', desc: 'Jaise-jaise platform grow karega, aapki passive income badhti jayegi.' }
            ]
        }
    },
    'layout_events': {
        title: 'Events & Contests',
        description: 'WIN BIG PRIZES',
        data: {
            headline: 'WIN BIG PRIZES',
            steps: [
                { title: 'WEEKLY CONTESTS', desc: 'Har hafte naye Exciting Events live hote hain, jo limited time ke liye hote hain.' },
                { title: 'MEGA JACKPOTS', desc: 'Contests mein bhag lekar aap ₹500 tak ka instant cash aur exciting prizes jeet sakte hain.' },
                { title: 'LEADERBOARD REWARDS', desc: 'Top earners ko special bonuses aur verification badges diye jaate hain.' }
            ]
        }
    }
};

const seedAllMarketing = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(uri);
        console.log('MongoDB Connected to All Marketing Seeder...');

        for (const [key, content] of Object.entries(DEFAULT_CONTENT)) {
            const dbKey = key.startsWith('menu_') ? key : `menu_${key.replace(/-/g, '_')}`;
            
            await Content.deleteOne({ key: dbKey });

            await Content.create({
                key: dbKey,
                title: content.title,
                description: content.description || content.subtitle,
                data: content.data || {
                    title: content.title,
                    subtitle: content.subtitle,
                    sections: content.sections
                }
            });
            console.log(`Seeded: ${dbKey}`);
        }

        console.log('Successfully migrated ALL Marketing sections to Database!');
        process.exit();
    } catch (error) {
        console.error('Error with data migration', error);
        process.exit(1);
    }
};

seedAllMarketing();
