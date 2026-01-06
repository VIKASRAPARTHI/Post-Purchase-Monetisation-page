const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email: 'rahul.sharma@email.com' }, '_id');
        console.log('TARGET_USER_ID:', user._id.toString());
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listUsers();
