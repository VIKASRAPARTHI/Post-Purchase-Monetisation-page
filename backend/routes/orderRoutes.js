const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const creditService = require('../services/creditService');
const { v4: uuidv4 } = require('uuid');

// Create a new order (Demo purpose)
router.post('/', async (req, res) => {
    try {
        const { userId, items, totalAmount, shippingAddress } = req.body;

        // 1. Create Order
        const order = new Order({
            userId,
            orderId: 'ORD-' + uuidv4().substring(0, 8).toUpperCase(),
            items,
            totalAmount,
            shippingAddress,
            creditsEarned: creditService.calculateCreditsForOrder(totalAmount)
        });

        await order.save();

        // 2. Create Locked Credits
        await creditService.createCreditEntry(userId, order._id, order.creditsEarned);

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Order Details
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }).populate('userId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get User Orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
