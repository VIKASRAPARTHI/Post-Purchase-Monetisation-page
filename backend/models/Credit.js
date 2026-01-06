const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['earned', 'boosted', 'bonus', 'redeemed', 'expired', 'adjustment', 'refund'],
        required: true
    },
    status: {
        type: String,
        enum: ['locked', 'active', 'used', 'expired'],
        default: 'locked'
    },
    description: {
        type: String
    },
    unlockDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    metadata: {
        isBoosted: { type: Boolean, default: false },
        originalAmount: Number,
        boostDate: Date,
        adminNote: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Credit', creditSchema);
