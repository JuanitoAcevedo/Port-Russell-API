const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  boatName: String,
  clientName: String,
  startDate: Date,
  endDate: Date,
  catwayNumber: Number
});

module.exports = mongoose.model("Reservation", reservationSchema);