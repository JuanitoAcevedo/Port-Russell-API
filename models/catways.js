const mongoose = require("mongoose");

/**
 * @typedef {Object} Catway
 * @property {Number} catwayNumber - Numéro unique du catway
 * @property {String} catwayType - Type du catway (long ou short)
 * @property {String} catwayState - État du catway (OK, KO, etc.)
 */

/**
 * Schéma Mongoose représentant un catway
 * @type {mongoose.Schema<Catway>}
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true, unique: true },
  catwayType: { type: String, enum: ["long", "short"], required: true },
  catwayState: { type: String, required: true }
});

module.exports = mongoose.model("Catway", catwaySchema);