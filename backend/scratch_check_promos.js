const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const PromotionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    brandName: String,
    brandLink: String,
    mobile: String,
    whatsapp: String,
    category: String,
    budget: Number,
    usersRequired: Number,
    description: String,
    status: String,
    createdAt: Date
});

const UserSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String
});

const Promotion = mongoose.model('Promotion', PromotionSchema);
const User = mongoose.model('User', UserSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dromoney');
        console.log('Connected to DB');

        const promos = await Promotion.find({}).populate('user');
        console.log(`Total promotions: ${promos.length}`);
        promos.forEach((p, idx) => {
            console.log(`\n--- Promotion ${idx + 1} ---`);
            console.log(`ID: ${p._id}`);
            console.log(`Brand Name: ${p.brandName}`);
            console.log(`Category: ${p.category}`);
            console.log(`Status: ${p.status}`);
            console.log(`User: ${p.user ? `${p.user.name} (${p.user.phone}) [${p.user._id}]` : 'None'}`);
        });

        const users = await User.find({});
        console.log(`\nTotal users in DB: ${users.length}`);
        users.forEach(u => {
            console.log(`- ${u.name} (${u.phone}) [${u._id}]`);
        });

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

check();
