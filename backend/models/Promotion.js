const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    credits: {
        type: Number,
        required: true
    },
    condition: {
        type: String, // e.g., 'Referral', 'First Purchase', 'Spend > 500'
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    targetAudience: {
        type: String,
        enum: ['All Users', 'New Users', 'Returning VIPs'],
        default: 'All Users'
    },
    status: {
        type: String,
        enum: ['Active', 'Scheduled', 'Ended', 'Draft'],
        default: 'Draft'
    },
    usageCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Promotion', promotionSchema);
