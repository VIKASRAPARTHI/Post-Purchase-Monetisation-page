const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        productId: String,
        name: String,
        quantity: Number,
        price: Number,
        image: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        name: String,
        addressLine: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    status: {
        type: String,
        enum: ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'confirmed'
    },
    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        description: String
    }],
    paymentMethod: {
        type: String, // e.g., 'Credit Card', 'UPI', 'COD'
        default: 'Credit Card'
    },
    creditsEarned: {
        type: Number,
        default: 0
    },
    creditsStatus: {
        type: String,
        enum: ['pending', 'locked', 'unlocked', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
