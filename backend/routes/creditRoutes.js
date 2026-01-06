const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');
const walletPlan = require('../models/WalletPlan');
const Transaction = require('../models/Transaction');
const creditService = require('../services/creditService');
const pricingService = require('../services/pricingService');

// Get User Credits Balance & Info
router.get('/user/:userId', async (req, res) => {
    try {
        // This is usually fetched from User model, but we can also aggregate from Credits
        // Use service to ensure sync? Or mostly just read User model.
        // Let's return comprehensive dashboard data
        const credits = await Credit.find({ userId: req.params.userId }).sort({ createdAt: -1 });

        // Calculate totals locally or fetch from user
        let totalActive = 0;
        let totalLocked = 0;
        credits.forEach(c => {
            if (c.status === 'active') totalActive += c.amount;
            if (c.status === 'locked') totalLocked += c.amount;
        });

        res.json({
            balance: totalActive,
            locked: totalLocked,
            history: credits
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Calculate Pricing for Features (Dynamic)
router.get('/pricing', async (req, res) => {
    try {
        const boosterPrice = await pricingService.getCreditBoosterPrice();
        const unlockPrice = await pricingService.getEarlyUnlockPrice();
        const premiumPrice = await pricingService.getPremiumWalletPrice();

        res.json({
            creditBooster: boosterPrice,
            earlyUnlock: unlockPrice,
            premiumWallet: premiumPrice
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Purchase Credit Booster
router.post('/boost', async (req, res) => {
    try {
        const { userId, creditId } = req.body;
        const price = await pricingService.getCreditBoosterPrice();

        // Simulate Payment Processing
        // In real app, verify payment here

        // Perform Boost
        const boostedCredit = await creditService.boostCredits(userId, creditId);

        // Record Transaction
        await Transaction.create({
            userId,
            type: 'credit_booster',
            amount: price,
            status: 'completed',
            metadata: { creditsAffected: boostedCredit.amount }
        });

        res.json({ success: true, credit: boostedCredit });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Purchase Early Unlock
router.post('/early-unlock', async (req, res) => {
    try {
        const { userId, creditId } = req.body;
        const price = await pricingService.getEarlyUnlockPrice();

        // Unlock
        const unlockedCredit = await creditService.earlyUnlock(userId, creditId);

        // Record Transaction
        await Transaction.create({
            userId,
            type: 'early_unlock',
            amount: price,
            status: 'completed',
            metadata: { creditsAffected: unlockedCredit.amount }
        });

        res.json({ success: true, credit: unlockedCredit });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
