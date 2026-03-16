const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { auth } = require("../middleware/auth");

// GET all users
router.get("/", auth, async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});

// GET user by email
router.get("/:email", auth, async (req, res) => {
  const user = await User.findOne({ email: req.params.email }, "-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// CREATE user
router.post("/", auth, async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE user
router.put("/:email", auth, async (req, res) => {
  const updated = await User.findOneAndUpdate(
    { email: req.params.email },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "User not found" });
  res.json(updated);
});

// DELETE user
router.delete("/:email", auth, async (req, res) => {
  const deleted = await User.findOneAndDelete({ email: req.params.email });
  if (!deleted) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted" });
});

// GET connected user
router.get("/me", auth, async (req, res) => {
  const user = await User.findOne({ email: req.userEmail }, "-password");
  res.json(user);
});

module.exports = router;