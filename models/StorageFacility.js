const mongoose = require('mongoose');

const storageFacilitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: String, required: true },  // e.g., '500 MT'
    contactDetails: { type: String, required: true },
    type: { type: String, enum: ['Cold Storage', 'Warehouse'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('StorageFacility', storageFacilitySchema);
