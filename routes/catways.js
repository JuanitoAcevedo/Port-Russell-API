const express = require("express");
const router = express.Router();
const Catway = require("../models/catways");
const { auth } = require("../middleware/auth");

/**
 * @route GET /catways
 * @description Récupère la liste complète des catways
 * @access Private (token requis)
 * @returns {Array<Object>} Liste des catways
 */
router.get("/", auth, async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route GET /catways/:number
 * @description Récupère un catway selon son numéro
 * @access Private (token requis)
 * @param {Number} req.params.number - Numéro du catway
 * @returns {Object} Catway correspondant
 */
router.get("/:number", auth, async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.number });
    if (!catway) return res.status(404).json({ error: "Catway not found" });
    res.json(catway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route POST /catways
 * @description Crée un nouveau catway
 * @access Private (token requis)
 * @body {Number} catwayNumber - Numéro du catway
 * @body {String} catwayType - Type du catway (small, medium, large)
 * @body {String} [catwayState=OK] - État du catway
 * @returns {Object} Catway créé
 */
router.post("/", auth, async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    if (!catwayNumber || !catwayType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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

/**
 * @route PUT /catways/:number
 * @description Met à jour un catway existant
 * @access Private (token requis)
 * @param {Number} req.params.number - Numéro du catway à modifier
 * @body {Number} catwayNumber - Nouveau numéro
 * @body {String} catwayType - Nouveau type
 * @body {String} catwayState - Nouvel état
 * @returns {Object} Catway mis à jour
 */
router.put("/:number", auth, async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

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

/**
 * @route DELETE /catways/:number
 * @description Supprime un catway selon son numéro
 * @access Private (token requis)
 * @param {Number} req.params.number - Numéro du catway à supprimer
 * @returns {Object} Message de confirmation
 */
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