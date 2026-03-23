const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * @typedef {Object} User
 * @property {String} username - Nom d'utilisateur
 * @property {String} email - Adresse email unique
 * @property {String} password - Mot de passe hashé
 */

/**
 * Schéma Mongoose représentant un utilisateur
 * @type {mongoose.Schema<User>}
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/**
 * Hash automatiquement le mot de passe avant sauvegarde
 * @function
 * @name userSchema.pre("save")
 * @param {Function} next - Fonction de callback
 */
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);