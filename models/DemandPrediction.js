const mongoose = require('mongoose');

const demandPredictionSchema = new mongoose.Schema({
    crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    currentDemand: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    predictedDemand: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('DemandPrediction', demandPredictionSchema);
