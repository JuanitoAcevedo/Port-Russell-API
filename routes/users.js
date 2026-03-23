const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { auth } = require("../middleware/auth");

/**
 * @route POST /users
 * @description Crée un nouvel utilisateur
 * @access Public
 */
router.post("/", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route POST /users/login
 * @description Authentifie un utilisateur et renvoie un token JWT
 * @access Public
 * @body {String} email - Email de l'utilisateur
 * @body {String} password - Mot de passe de l'utilisateur
 * @returns {Object} Token JWT
 */
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = user.generateAuthToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route GET /users/me
 * @description Renvoie les informations de l'utilisateur connecté
 * @access Private (token requis)
 * @returns {Object} Informations de l'utilisateur (sans mot de passe)
 */
router.get("/me", auth, async (req, res) => {
  const user = await User.findOne(
    { email: req.userEmail },
    "-password"
  );
  res.json(user);
});

/**
 * @route POST /users/logout
 * @description Déconnecte l'utilisateur (symbolique côté API)
 * @access Private (token requis)
 * @returns {Object} Message de confirmation
 */
router.post("/logout", auth, async (req, res) => {
  res.json({ message: "Logged out" });
});

module.exports = router;