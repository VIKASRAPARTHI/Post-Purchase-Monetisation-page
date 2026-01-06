const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const WalletPlan = require('../models/WalletPlan');
const creditService = require('../services/creditService');

// --- Analytics ---

router.get('/credits/stats', async (req, res) => {
    try {
        // Basic stats
        const totalIssued = await Credit.aggregate([
            { $match: { type: { $in: ['earned', 'boosted', 'bonus'] } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const boostRevenue = await Transaction.aggregate([
            { $match: { type: 'credit_booster', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const activePremium = await User.countDocuments({ 'wallet.isPremium': true });

        res.json({
            totalIssued: totalIssued[0]?.total || 0,
            boostRevenue: boostRevenue[0]?.total || 0,
            activePremiumWallets: activePremium
        });
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

module.exports = router;
