const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String },
    valueAdditionIdeas: [{ type: String }],
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
