const WalletPlan = require('../models/WalletPlan');

const pricingService = {
    // Get price for Credit Booster
    async getCreditBoosterPrice() {
        // Try to find dynamic pricing from DB, otherwise default
        const plan = await WalletPlan.findOne({ planId: 'credit_booster', isActive: true });
        return plan ? plan.price : 49; // Default ₹49
    },

    // Get price for Early Unlock
    async getEarlyUnlockPrice() {
        const plan = await WalletPlan.findOne({ planId: 'early_unlock', isActive: true });
        return plan ? plan.price : 29; // Default ₹29
    },

    // Get price for Premium Wallet
    async getPremiumWalletPrice() {
        const plan = await WalletPlan.findOne({ planId: 'premium_wallet', isActive: true });
        return plan ? plan.price : 99; // Default ₹99
    },

    // Calculate default credit calculation rate (e.g. 5% of order)
    getCreditRate() {
        return 0.05;
    }
};

module.exports = pricingService;
