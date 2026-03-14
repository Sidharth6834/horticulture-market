const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
    crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    marketLocation: { type: String, required: true },
    pricePerKg: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
