const Credit = require('../models/Credit');
const User = require('../models/User');
const Order = require('../models/Order');
const pricingService = require('./pricingService');
const { addDays, isPast } = require('date-fns');

const creditService = {
    // Calculate credits for an order
    calculateCreditsForOrder(orderAmount) {
        const rate = pricingService.getCreditRate();
        return Math.floor(orderAmount * rate); // Round down to integer
    },

    // Create initial locked credits for an order
    async createCreditEntry(userId, orderId, amount) {
        const unlockDate = addDays(new Date(), 7); // Unlock in 7 days
        const expiryDate = addDays(unlockDate, 90); // Expire 90 days after unlock

        const credit = new Credit({
            userId,
            orderId,
            amount,
            type: 'earned',
            status: 'locked',
            unlockDate,
            expiryDate,
            description: 'Credits earned from order'
        });

        await credit.save();

        // Update user wallet stats
        await this.updateUserWallet(userId);

        return credit;
    },

    // Unlock credits (usually called by cron job or after delivery webhook)
    async unlockCredits(creditId) {
        const credit = await Credit.findById(creditId);
        if (!credit || credit.status !== 'locked') return null;

        credit.status = 'active';
        await credit.save();
        await this.updateUserWallet(credit.userId);
        return credit;
    },

    // Boost credits (double them)
    async boostCredits(userId, creditId) {
        const credit = await Credit.findOne({ _id: creditId, userId });

        // Can only boost locked or active credits that haven't been boosted
        if (!credit || credit.metadata.isBoosted) {
            throw new Error('Credit cannot be boosted');
        }

        const originalAmount = credit.amount;
        const boostedAmount = originalAmount * 2;

        credit.amount = boostedAmount;
        credit.type = 'boosted';
        credit.metadata.isBoosted = true;
        credit.metadata.originalAmount = originalAmount;
        credit.metadata.boostDate = new Date();

        await credit.save();
        await this.updateUserWallet(userId);

        return credit;
    },

    // Early unlock
    async earlyUnlock(userId, creditId) {
        const credit = await Credit.findOne({ _id: creditId, userId });

        if (!credit || credit.status !== 'locked') {
            throw new Error('Credit cannot be unlocked early');
        }

        credit.status = 'active';
        credit.unlockDate = new Date(); // Unlocked now
        // Extend expiry if needed or keep original relative duration

        await credit.save();
        await this.updateUserWallet(userId);
        return credit;
    },

    // Recalculate and update user wallet totals
    async updateUserWallet(userId) {
        const credits = await Credit.find({ userId });

        let totalCredits = 0;
        let lockedCredits = 0;

        credits.forEach(c => {
            if (c.status === 'active') {
                totalCredits += c.amount;
            } else if (c.status === 'locked') {
                lockedCredits += c.amount;
            }
        });

        // We normally don't subtract used credits from "totalCredits" if it represents *balance*.
        // If 'active' means currently available, then we sum active.
        // However, if we track 'used' credits in the same collection, we should ensure we only sum 'active'.
        // NOTE: In a real system, we'd have a ledger. Here we sum 'active' credits.
        // If we use credits, we should probably change status to 'used' or create a deduction entry.
        // Let's assume 'active' credits are available balance.

        await User.findByIdAndUpdate(userId, {
            'wallet.totalCredits': totalCredits,
            'wallet.lockedCredits': lockedCredits
        });
    },

    // Manually issue credits (Admin)
    async issueManualCredits(userId, amount, reason) {
        const expiryDate = addDays(new Date(), 90);

        const credit = new Credit({
            userId,
            amount,
            type: 'adjustment', // or 'bonus'
            status: 'active',
            description: reason || 'Manual adjustment',
            unlockDate: new Date(),
            expiryDate,
            metadata: { adminNote: reason }
        });

        await credit.save();
        await this.updateUserWallet(userId);
        return credit;
    }
};

module.exports = creditService;
