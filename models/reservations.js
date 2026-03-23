const mongoose = require("mongoose");

/**
 * @typedef {Object} Reservation
 * @property {String} boatName - Nom du bateau
 * @property {String} clientName - Nom du client
 * @property {Date} startDate - Date de début de la réservation
 * @property {Date} endDate - Date de fin de la réservation
 * @property {Number} catwayNumber - Numéro du catway réservé
 */

/**
 * Schéma Mongoose représentant une réservation
 * @type {mongoose.Schema<Reservation>}
 */
const reservationSchema = new mongoose.Schema({
  boatName: { type: String, required: true },
  clientName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  catwayNumber: { type: Number, required: true }
});

module.exports = mongoose.model("Reservation", reservationSchema);