const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    conditionType: {
        type: String,
        enum: ['order_value', 'product_purchase'],
        required: true
    },
    conditionValue: {
        type: Number, // e.g. 2500 for order value
        required: true
    },
    rewardAmount: {
        type: Number,
        required: true
    },
    unlockPeriod: {
        type: Number, // in days
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Rule', ruleSchema);
