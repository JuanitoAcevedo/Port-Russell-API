const Catway = require('../models/catways');

// GET ALL CATWAYS

exports.getAll = async (req, res, next) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    return res.status(200).json(catways);
  } catch (err) {
    return res.status(500).json({ message: "error_fetching_catways", error: err.message });
  }
};

// GET ONE CATWAY BY NUMBER

exports.getByNumber = async (req, res, next) => {
  try {
    const number = parseInt(req.params.number, 10);

    if (isNaN(number)) {
      return res.status(400).json({ message: "invalid_catway_number" });
    }

    const catway = await Catway.findOne({ catwayNumber: number });

    if (!catway) {
      return res.status(404).json({ message: "catway_not_found" });
    }

    return res.status(200).json(catway);
  } catch (err) {
    return res.status(500).json({ message: "error_fetching_catway", error: err.message });
  }
};

// ADD A NEW CATWAY

exports.add = async (req, res, next) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    if (!catwayNumber || !catwayType) {
      return res.status(400).json({ message: "missing_required_fields" });
    }

    const exists = await Catway.findOne({ catwayNumber });
    if (exists) {
      return res.status(409).json({ message: "catway_number_already_exists" });
    }

    const newCatway = new Catway({
      catwayNumber,
      catwayType,
      catwayState
    });

    await newCatway.save();

    return res.status(201).json(newCatway);
  } catch (err) {
    return res.status(500).json({ message: "error_creating_catway", error: err.message });
  }
};

// UPDATE A CATWAY

exports.update = async (req, res, next) => {
  try {
    const number = parseInt(req.params.number, 10);

    if (isNaN(number)) {
      return res.status(400).json({ message: "invalid_catway_number" });
    }

    const updated = await Catway.findOneAndUpdate(
      { catwayNumber: number },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "catway_not_found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: "error_updating_catway", error: err.message });
  }
};

// DELETE A CATWAY

exports.delete = async (req, res, next) => {
  try {
    const number = parseInt(req.params.number, 10);

    if (isNaN(number)) {
      return res.status(400).json({ message: "invalid_catway_number" });
    }

    const deleted = await Catway.findOneAndDelete({ catwayNumber: number });

    if (!deleted) {
      return res.status(404).json({ message: "catway_not_found" });
    }

    return res.status(200).json({ message: "catway_deleted", deleted });
  } catch (err) {
    return res.status(500).json({ message: "error_deleting_catway", error: err.message });
  }
};