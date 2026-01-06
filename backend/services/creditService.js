const Credit = require('../models/Credit');
const User = require('../models/User');
const Order = require('../models/Order');
const Setting = require('../models/Setting'); // Import Setting
const { addDays, isPast } = require('date-fns');

const creditService = {
    // Helper to get current rate
    async getCreditRate() {
        const setting = await Setting.findOne({ key: 'pointsPer100' });
        // Default to 5 credits per 100 currency units (0.05) if not set
        // Admin panel creates 'pointsPer100', e.g. value 5
        return setting ? (Number(setting.value) / 100) : 0.05;
    },

    // Calculate credits for an order (Dynamic)
    async calculateCreditsForOrder(orderAmount) {
        const rate = await this.getCreditRate();
        return Math.floor(orderAmount * rate);
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
        // Fetch booster multiplier from settings
        const setting = await Setting.findOne({ key: 'creditBooster' });
        const multiplier = setting && setting.value.multiplier ? Number(setting.value.multiplier) : 2;

        const boostedAmount = originalAmount * multiplier;

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
