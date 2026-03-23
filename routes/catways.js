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
    const catway = await Catway.findOne({ catwayNumber: req.params.number });
    if (!catway) return res.status(404).json({ error: "Catway not found" });
    res.json(catway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE catway
router.post("/", auth, async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    // Validation des champs
    if (!catwayNumber || !catwayType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Vérifier si le catway existe déjà
    const exists = await Catway.findOne({ catwayNumber });
    if (exists) {
      return res.status(400).json({ error: "Catway already exists" });
    }

    const newCatway = new Catway({
      catwayNumber,
      catwayType,
      catwayState: catwayState || "OK"
    });

    await newCatway.save();
    res.json(newCatway);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE catway
router.put("/:number", auth, async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    // Validation
    if (!catwayNumber || !catwayType || !catwayState) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.number },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Catway not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE catway (optionnel)
router.delete("/:number", auth, async (req, res) => {
  try {
    const deleted = await Catway.findOneAndDelete({ catwayNumber: req.params.number });
    if (!deleted) return res.status(404).json({ error: "Catway not found" });
    res.json({ message: "Catway deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;