const mongoose = require('mongoose');
const User = require('../models/User');
const Payment = require('../models/Payment');
require('dotenv').config();

const testSubscription = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const testEmail = 'chandan@gmail.com';
        const user = await User.findOne({ email: testEmail });

        if (!user) {
            console.error('User not found!');
            process.exit(1);
        }

        console.log(`Original Expiry: ${user.supportExpiry}`);
        console.log(`Original Plan: ${user.activeBusinessPlan}`);
        console.log(`Original Status: ${user.businessPlanStatus}`);

        // Simulate creating a payment record
        const payment = await Payment.create({
            user: user._id,
            plan: 'Gold Membership',
            paymentType: 'BUSINESS_HUB_PLAN',
            planDuration: '/ Yearly',
            amount: 499,
            method: 'Razorpay',
            razorpayOrderId: 'order_test_123',
            status: 'Pending'
        });

        console.log('\nSimulating Payment Verification...');

        // LOGIC FROM RAZORPAY CONTROLLER
        if (payment.paymentType === 'BUSINESS_HUB_PLAN') {
            const planDuration = payment.planDuration || 'Monthly';
            const daysToAdd = planDuration.toLowerCase().includes('year') ? 365 : 30;
            
            let currentExpiry = user.supportExpiry && new Date(user.supportExpiry) > new Date() 
                ? new Date(user.supportExpiry) 
                : new Date();
            
            currentExpiry.setDate(currentExpiry.getDate() + daysToAdd);
            
            user.supportExpiry = currentExpiry;
            user.activeBusinessPlan = payment.plan || 'Premium Plan';
            user.businessPlanStatus = 'active';
            user.isPaid = true;
            
            payment.status = 'Success';
            payment.processedAt = new Date();
            
            await user.save();
            await payment.save();
        }

        const updatedUser = await User.findOne({ email: testEmail });
        console.log('\n--- VERIFICATION RESULTS ---');
        console.log(`New Expiry: ${updatedUser.supportExpiry}`);
        console.log(`New Plan: ${updatedUser.activeBusinessPlan}`);
        console.log(`New Status: ${updatedUser.businessPlanStatus}`);
        console.log(`Is Paid: ${updatedUser.isPaid}`);
        
        const daysDiff = Math.ceil((new Date(updatedUser.supportExpiry) - new Date()) / (1000 * 60 * 60 * 24));
        console.log(`Days added: ${daysDiff}`);

        if (updatedUser.businessPlanStatus === 'active' && updatedUser.activeBusinessPlan === 'Gold Membership') {
            console.log('\n✅ TEST PASSED: Database updated correctly.');
        } else {
            console.log('\n❌ TEST FAILED: Verification failed.');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testSubscription();
