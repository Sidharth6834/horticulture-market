const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const auth = require('../middlewares/auth');

// Get all crops
router.get('/', async (req, res) => {
    try {
        const crops = await Crop.find();
        res.json(crops);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a crop (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    try {
        const newCrop = new Crop(req.body);
        const crop = await newCrop.save();
        res.json(crop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
