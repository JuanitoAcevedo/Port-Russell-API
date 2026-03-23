const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservations");
const { auth } = require("../middleware/auth");

// GET all reservations
router.get("/", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET reservation by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE reservation
router.post("/", auth, async (req, res) => {
  try {
    const { boatName, clientName, startDate, endDate, catwayNumber } = req.body;

    // Vérification des champs obligatoires
    if (!boatName || !clientName || !startDate || !endDate || !catwayNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Vérification start < end
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }

    // Vérification du chevauchement
    const overlap = await Reservation.findOne({
      catwayNumber,
      startDate: { $lt: endDate },
      endDate: { $gt: startDate }
    });

    if (overlap) {
      return res.status(400).json({ error: "Catway already reserved for these dates" });
    }

    // Création si tout est OK
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.json(newReservation);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE reservation
router.put("/:id", auth, async (req, res) => {
  try {
    const { boatName, clientName, startDate, endDate, catwayNumber } = req.body;

    // Vérification des champs obligatoires
    if (!boatName || !clientName || !startDate || !endDate || !catwayNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Vérification start < end
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }

    // Vérification du chevauchement
    const overlap = await Reservation.findOne({
      _id: { $ne: req.params.id },
      catwayNumber,
      startDate: { $lt: endDate },
      endDate: { $gt: startDate }
    });

    if (overlap) {
      return res.status(400).json({ error: "Catway already reserved for these dates" });
    }

    // Mise à jour
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE reservation
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Reservation not found" });
    res.json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;