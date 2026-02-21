const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  catway: { type: mongoose.Schema.Types.ObjectId, ref: "Catway", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("reservations", reservationSchema);