const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CatwaySchema = new Schema({
  catwayNumber: {
    type: Number,
    required: true,
    unique: true
  },
  catwayType: {
    type: String,
    enum: ['long', 'short'],
    required: true
  },
  catwayState: {
    type: String,
    enum: ['OK', 'maintenance', 'occupied', 'unavailable'],
    default: 'OK',
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Catway', CatwaySchema);
