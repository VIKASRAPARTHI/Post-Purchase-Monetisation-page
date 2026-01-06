const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Credit = require('./models/Credit');
const Transaction = require('./models/Transaction');
const Setting = require('./models/Setting');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SAMPLE_USERS = [
    { name: 'Rahul Sharma', email: 'rahul.sharma@email.com' },
    { name: 'Priya Patel', email: 'priya.p@email.com' },
    { name: 'Amit Singh', email: 'amit.singh@email.com' },
    { name: 'Sneha Gupta', email: 'sneha.g@email.com' },
    { name: 'Vikram Malhotra', email: 'vikram.m@email.com' },
    { name: 'Anjali Desai', email: 'anjali.d@email.com' },
    { name: 'Rohan Verma', email: 'rohan.v@email.com' },
    { name: 'Kavita Reddy', email: 'kavita.r@email.com' },
    { name: 'Arjun Nair', email: 'arjun.n@email.com' },
    { name: 'Meera Kapoor', email: 'meera.k@email.com' },
    { name: 'Siddharth Rao', email: 'sid.rao@email.com' },
    { name: 'Pooja Mehta', email: 'pooja.m@email.com' }
];

const PRODUCTS = [
    { id: 'p1', name: 'Wireless Headphones', price: 2999, category: 'Electronics' },
    { id: 'p2', name: 'Running Shoes', price: 3499, category: 'Fashion' },
    { id: 'p3', name: 'Smart Watch', price: 4999, category: 'Electronics' },
    { id: 'p4', name: 'Leather Wallet', price: 999, category: 'Fashion' },
    { id: 'p5', name: 'Bluetooth Speaker', price: 1999, category: 'Electronics' },
    { id: 'p6', name: 'Sunglasses', price: 1500, category: 'Fashion' },
    { id: 'p7', name: 'Backpack', price: 2499, category: 'Travel' },
    { id: 'p8', name: 'Coffee Maker', price: 4500, category: 'Home' }
];

const ORDER_STATUSES = ['confirmed', 'shipped', 'delivered', 'delivered', 'delivered', 'cancelled'];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data? (Maybe safer to just add if not exists, but for clean mock state, let's clear except Settings)
        await Order.deleteMany({});
        await User.deleteMany({});
        await Credit.deleteMany({});
        await Transaction.deleteMany({});
        console.log('Cleared Orders, Users, Credits, Transactions');

        // Initial Settings if missing
        await Setting.updateOne(
            { key: 'creditBooster' },
            { $set: { value: { price: 49, multiplier: 2, enabled: true, description: 'Double credits instantly' }, updatedAt: new Date() } },
            { upsert: true }
        );

        const users = [];

        for (const u of SAMPLE_USERS) {
            const user = await User.create({
                name: u.name,
                email: u.email,
                phone: `9${getRandomInt(100000000, 999999999)}`,
                wallet: {
                    totalCredits: 0,
                    lockedCredits: 0,
                    expiringCredits: 0,
                    isPremium: Math.random() > 0.8
                }
            });
            users.push(user);
            console.log(`Created user: ${user.name}`);
        }

        // Generate Data for each user
        for (const user of users) {
            const numOrders = getRandomInt(8, 15);
            let totalWalletCredits = 0;

            for (let i = 0; i < numOrders; i++) {
                const orderDate = getRandomDate(new Date(2023, 0, 1), new Date());
                const status = getRandomItem(ORDER_STATUSES);

                // Generate Items
                const numItems = getRandomInt(1, 3);
                const orderItems = [];
                let totalAmount = 0;

                for (let j = 0; j < numItems; j++) {
                    const prod = getRandomItem(PRODUCTS);
                    const qty = getRandomInt(1, 2);
                    orderItems.push({
                        productId: prod.id,
                        name: prod.name,
                        quantity: qty,
                        price: prod.price,
                        image: `https://placehold.co/100x100?text=${prod.name.split(' ')[0]}`
                    });
                    totalAmount += prod.price * qty;
                }

                // Generate Order
                const order = await Order.create({
                    userId: user._id,
                    orderId: `${getRandomInt(100000, 999999)}`,
                    totalAmount,
                    status,
                    items: orderItems,
                    shippingAddress: {
                        name: user.name,
                        addressLine: '123 Test Street',
                        city: 'Mumbai',
                        state: 'MH',
                        pincode: '400001',
                        country: 'India'
                    },
                    paymentMethod: 'Credit Card',
                    creditsEarned: Math.floor(totalAmount * 0.05), // 5% earn rate
                    creditsStatus: status === 'delivered' ? 'unlocked' : 'locked',
                    createdAt: orderDate
                });

                // Generate Credit Entry if delivered
                if (status === 'delivered') {
                    const credit = await Credit.create({
                        userId: user._id,
                        type: 'earned',
                        amount: order.creditsEarned,
                        orderId: order._id,
                        description: `Earned from Order #${order.orderId}`,
                        status: 'active',
                        expiryDate: new Date(orderDate.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days
                        createdAt: orderDate
                    });
                    totalWalletCredits += credit.amount;

                    // Transaction Log
                    await Transaction.create({
                        userId: user._id,
                        type: 'credit_earned',
                        amount: credit.amount,
                        referenceId: order._id,
                        status: 'completed',
                        createdAt: orderDate
                    });
                }

                // Generate Credit Entry if shipped/confirmed (Locked)
                if (status === 'shipped' || status === 'confirmed') {
                    // Locked credits don't go into 'totalCredits' usually shown as available,
                    // but we might want track them. For now, simple logic.
                }
            }

            // Random Manual Adjustment
            if (Math.random() > 0.7) {
                const amount = getRandomInt(50, 200);
                await Credit.create({
                    userId: user._id,
                    type: 'bonus',
                    amount: amount,
                    description: 'Loyalty Bonus',
                    status: 'active',
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    createdAt: new Date()
                });
                totalWalletCredits += amount;

                await Transaction.create({
                    userId: user._id,
                    type: 'manual_adjustment',
                    amount: amount,
                    status: 'completed',
                    createdAt: new Date()
                });
            }

            // Update Wallet
            user.wallet.totalCredits = totalWalletCredits;
            // Calculate hypothetical expiring
            user.wallet.expiringCredits = Math.floor(totalWalletCredits * 0.2);
            await user.save();
        }

        console.log('Seeding completed successfully!');
        mongoose.connection.close();

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
