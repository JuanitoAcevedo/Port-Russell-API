const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/users");
const { tokens } = require("../middleware/auth");

const router = express.Router();

/**
 * @route POST /auth/login
 * @description Authentifie un utilisateur via email/mot de passe et génère un token en mémoire
 * @access Public
 * @body {String} email - Email de l'utilisateur
 * @body {String} password - Mot de passe de l'utilisateur
 * @returns {Object} Token généré
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Utilisateur introuvable" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Mot de passe incorrect" });

  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(email, token);

  res.json({ token });
});

/**
 * @route GET /auth/logout
 * @description Déconnecte l'utilisateur en supprimant son token du stockage en mémoire
 * @access Private (token requis)
 * @header {String} Authorization - Token au format Bearer
 * @returns {Object} Message de confirmation
 */
router.get("/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(400).json({ error: "Token manquant" });

  const entry = [...tokens.entries()].find(([_, t]) => t === token);
  if (entry) tokens.delete(entry[0]);

  res.json({ message: "Déconnecté" });
});

module.exports = router;