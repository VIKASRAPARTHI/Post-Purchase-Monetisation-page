const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const WalletPlan = require('../models/WalletPlan');
const creditService = require('../services/creditService');

// --- Analytics ---

// --- Analytics ---

router.get('/credits/stats', async (req, res) => {
    try {
        // 1. Total Issued
        const totalIssuedRes = await Credit.aggregate([
            { $match: { type: { $in: ['earned', 'boosted', 'bonus'] } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalIssued = totalIssuedRes[0]?.total || 0;

        // 2. Total Redeemed (Used)
        const totalRedeemedRes = await Credit.aggregate([
            { $match: { type: 'redeemed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRedeemed = Math.abs(totalRedeemedRes[0]?.total || 0);

        // 3. Total Expired
        const totalExpiredRes = await Credit.aggregate([
            { $match: { type: 'expired' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalExpired = Math.abs(totalExpiredRes[0]?.total || 0);

        // 4. Boost/Subscription Revenue (Transactions)
        const boostRevRes = await Transaction.aggregate([
            { $match: { type: { $in: ['credit_booster', 'premium_wallet_subscription'] }, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const boostRevenue = boostRevRes[0]?.total || 0;

        // 5. Order Revenue (Simulated from Orders for now)
        const orderRevRes = await require('../models/Order').aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const orderRevenue = orderRevRes[0]?.total || 0;

        const netRevenue = boostRevenue + orderRevenue;
        const redemptionRate = totalIssued > 0 ? ((totalRedeemed / totalIssued) * 100).toFixed(1) : 0;
        const breakageRate = totalIssued > 0 ? ((totalExpired / totalIssued) * 100).toFixed(1) : 0;

        const activePremium = await User.countDocuments({ 'wallet.isPremium': true });

        res.json({
            totalIssued,
            totalRedeemed,
            netRevenue,
            redemptionRate,
            breakageRate,
            activePremiumWallets: activePremium,
            boostRevenue // legacy support if needed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/credits/trends', async (req, res) => {
    try {
        // Simple daily issuance last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyIssued = await Credit.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                    type: { $in: ['earned', 'boosted', 'bonus'] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(dailyIssued);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Transactions ---

router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(50);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- User Credit Management (New Features) ---

// Search users
// Search users (or list recent)
router.get('/users/search', async (req, res) => {
    try {
        const { q } = req.query;
        let query = {};

        if (q && q.trim().length > 0) {
            const regex = new RegExp(q, 'i');
            query = {
                $or: [{ name: regex }, { email: regex }]
            };
            // Only add ID search if it looks like an ObjectId
            if (q.match(/^[0-9a-fA-F]{24}$/)) {
                query.$or.push({ _id: q });
            }
        }

        const users = await User.find(query).limit(20).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific user credits detail
router.get('/users/:userId/credits', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const credits = await Credit.find({ userId: req.params.userId }).sort({ createdAt: -1 });

        res.json({
            user,
            credits
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Manual Adjust (Issue/Revoke)
router.post('/users/:userId/credits/adjust', async (req, res) => {
    try {
        const { amount, reason, action } = req.body; // action: 'issue' or 'revoke'
        const userId = req.params.userId;

        let credit;
        if (action === 'issue') {
            credit = await creditService.issueManualCredits(userId, Number(amount), reason);
        } else if (action === 'revoke') {
            // For verify, we'd need a revoke logic in service, but for now we'll just create a negative adjustment
            // Note: Real revocation might need to target specific credit IDs or check balance.
            // We'll assume simple negative balance adjustment for now.
            const negAmount = -1 * Math.abs(Number(amount));
            const newCredit = new Credit({
                userId,
                amount: negAmount,
                type: 'adjustment',
                status: 'active', // Immediately effective
                description: reason || 'Manual revocation'
            });
            await newCredit.save();
            await creditService.updateUserWallet(userId);
            credit = newCredit;
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        res.json({ success: true, credit });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const Setting = require('../models/Setting');

// --- Settings ---

// Get all settings
router.get('/settings', async (req, res) => {
    try {
        const settings = await Setting.find({});
        // Convert array to object for easier frontend consumption
        const settingsMap = {};
        settings.forEach(s => {
            settingsMap[s.key] = s.value;
        });
        res.json(settingsMap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a setting
router.post('/settings', async (req, res) => {
    try {
        const { key, value } = req.body;
        const setting = await Setting.findOneAndUpdate(
            { key },
            { value, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/credits/issue', async (req, res) => {
    // Global issue or old endpoint alias
    try {
        const { userId, amount, reason } = req.body;
        const credit = await creditService.issueManualCredits(userId, amount, reason);
        res.json(credit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const Rule = require('../models/Rule');

// --- Rules ---

// Get all rules
router.get('/rules', async (req, res) => {
    try {
        const rules = await Rule.find({}).sort({ createdAt: -1 });
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a rule
router.post('/rules', async (req, res) => {
    try {
        const rule = new Rule(req.body);
        await rule.save();
        res.status(201).json(rule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Toggle rule status
router.patch('/rules/:id/toggle', async (req, res) => {
    try {
        const rule = await Rule.findById(req.params.id);
        if (!rule) return res.status(404).json({ message: 'Rule not found' });

        rule.isActive = !rule.isActive;
        await rule.save();
        res.json(rule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a rule
router.delete('/rules/:id', async (req, res) => {
    try {
        await Rule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rule deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const Promotion = require('../models/Promotion');

// --- Promotions ---

// Get all promotions
router.get('/promotions', async (req, res) => {
    try {
        const promotions = await Promotion.find({}).sort({ createdAt: -1 });
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a promotion
router.post('/promotions', async (req, res) => {
    try {
        const promotion = new Promotion(req.body);
        await promotion.save();
        res.status(201).json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a promotion status
router.patch('/promotions/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const promotion = await Promotion.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(promotion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
