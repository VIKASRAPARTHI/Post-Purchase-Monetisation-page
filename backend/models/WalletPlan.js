const mongoose = require('mongoose');

const walletPlanSchema = new mongoose.Schema({
    planId: {
        type: String,
        required: true,
        unique: true // e.g., 'premium_monthly', 'credit_booster', 'early_unlock'
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    billingCycle: {
        type: String,
        enum: ['one_time', 'monthly', 'yearly'],
        default: 'one_time'
    },
    features: {
        creditMultiplier: { type: Number, default: 1 }, // 2 means 2x credits
        expiryOverride: { type: Boolean, default: false }, // true means never expire
        instantUnlock: { type: Boolean, default: false }, // true means instant unlock
        exclusiveAccess: { type: Boolean, default: false }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('WalletPlan', walletPlanSchema);
