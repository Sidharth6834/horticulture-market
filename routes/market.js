const express = require('express');
const router = express.Router();
const MarketPrice = require('../models/MarketPrice');
const auth = require('../middlewares/auth');

// Get market prices (optionally filtered by crop)
router.get('/', async (req, res) => {
    try {
        const query = req.query.crop ? { crop: req.query.crop } : {};
        const prices = await MarketPrice.find(query).populate('crop', 'name category');
        res.json(prices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add market price (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    try {
        const newPrice = new MarketPrice(req.body);
        const price = await newPrice.save();
        res.json(price);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
