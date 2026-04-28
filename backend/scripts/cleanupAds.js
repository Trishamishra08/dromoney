const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Find transactions related to "Ad Reward Conversion"
        const adsTransactions = await Transaction.find({ 
            source: { $regex: /Ad Reward Conversion/i } 
        });

        console.log(`Found ${adsTransactions.length} ad reward INR transactions`);

        for (const tx of adsTransactions) {
            const userId = tx.user;
            const amountToDeduct = tx.amount;

            console.log(`Processing correction for User ${userId}: Deducting ₹${amountToDeduct}`);

            // 2. Adjust User Wallet
            const user = await User.findById(userId);
            if (user) {
                user.wallet.balance = Math.max(0, user.wallet.balance - amountToDeduct);
                user.wallet.lifetimeEarnings = Math.max(0, user.wallet.lifetimeEarnings - amountToDeduct);
                // Also adjust todayEarnings if it was today
                user.wallet.todayEarnings = Math.max(0, user.wallet.todayEarnings - amountToDeduct);
                
                await user.save();
                console.log(`✅ Corrected wallet for user ${user.phone}`);
            }

            // 3. Delete the transaction record
            await Transaction.findByIdAndDelete(tx._id);
            console.log(`✅ Deleted transaction ref ${tx._id}`);
        }

        console.log('Cleanup completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

cleanup();
