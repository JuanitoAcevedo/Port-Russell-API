const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = "PORT_RUSSELL_SECRET";

// GET /users
exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /users/:email
exports.getByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "user_not_found" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /users
exports.add = async (req, res) => {
  console.log(">>> SERVICE.ADD EXÉCUTÉ !");
  try {
    const user = await User.create(req.body);

    console.log(">>> RÉPONSE ENVOYÉE PAR LE SERVICE :", user);

    return res.status(201).json(user);
  } catch (err) {
    console.log(">>> ERREUR DANS SERVICE :", err);
    return res.status(400).json({ error: err.message });
  }
};

// PUT /users/:email
exports.update = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "user_not_found" });

    Object.assign(user, req.body);
    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// DELETE /users/:email
exports.delete = async (req, res) => {
  try {
    await User.deleteOne({ email: req.params.email });
    return res.status(204).json();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "invalid_credentials" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: "invalid_credentials" });

    const token = jwt.sign(
      { email: user.email, username: user.username },
      SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /logout
exports.logout = async (req, res) => {
  return res.status(200).json({ message: "logged_out" });
};