const express = require("express");
const router = express.Router();
const Catway = require("../models/catways");
const { auth } = require("../middleware/auth");

// GET all catways
router.get("/", auth, async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET catway by number
router.get("/:number", auth, async (req, res) => {
  try {
    const catways = await Catway.findOne({ catwayNumber: req.params.number });
    if (!catway) return res.status(404).json({ error: "Catway not found" });
    res.json(catways);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;