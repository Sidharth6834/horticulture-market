const express = require('express');
const router = express.Router();
const StorageFacility = require('../models/StorageFacility');
const auth = require('../middlewares/auth');

// Get all storage facilities
router.get('/', async (req, res) => {
    try {
        const facilities = await StorageFacility.find();
        res.json(facilities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add storage facility (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    try {
        const newFacility = new StorageFacility(req.body);
        const facility = await newFacility.save();
        res.json(facility);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
