const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  boatName: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  catway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catway',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);