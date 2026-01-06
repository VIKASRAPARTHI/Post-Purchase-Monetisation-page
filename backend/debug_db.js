const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const debugDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log('--- USERS ---');
        users.forEach(u => console.log(`ID: ${u._id}, Email: ${u.email}, Name: ${u.name}`));

        const orders = await Order.find({});
        console.log('\n--- ORDERS ---');
        orders.forEach(o => console.log(`OrderID: ${o.orderId}, UserRef: ${o.userId}, Status: ${o.status}`));

        mongoose.connection.close();
    } catch (error) {
        console.error('Error debugging DB:', error);
    }
};

debugDb();
