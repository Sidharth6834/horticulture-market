const express = require('express');
const router = express.Router();
const DemandPrediction = require('../models/DemandPrediction');
const auth = require('../middlewares/auth');

// Get demand predictions (optionally filtered by crop)
router.get('/', async (req, res) => {
    try {
        const query = req.query.crop ? { crop: req.query.crop } : {};
        const predictions = await DemandPrediction.find(query).populate('crop', 'name category');
        res.json(predictions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add demand prediction (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    try {
        const newPrediction = new DemandPrediction(req.body);
        const prediction = await newPrediction.save();
        res.json(prediction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
