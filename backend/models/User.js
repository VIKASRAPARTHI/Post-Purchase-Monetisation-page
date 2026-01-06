const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    wallet: {
        totalCredits: {
            type: Number,
            default: 0
        },
        lockedCredits: {
            type: Number,
            default: 0
        },
        isPremium: {
            type: Boolean,
            default: false
        },
        premiumExpiryDate: {
            type: Date
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
