const express = require("express");
const router = express.Router({ mergeParams: true });
const Reservation = require("../models/reservations");
const Catway = require("../models/catways");
const { auth } = require("../middleware/auth");

// GET all reservations for a catway
router.get("/", auth, async (req, res) => {
  try {
    const catwayNumber = req.params.id;

    const reservations = await Reservation.find({ catwayNumber });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one reservation for a catway
router.get("/:idReservation", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE reservation for a catway
router.post("/", auth, async (req, res) => {
  try {
    const catwayNumber = req.params.id;

    // Vérifier que le catway existe
    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) return res.status(404).json({ error: "Catway not found" });

    const newReservation = new Reservation({
      ...req.body,
      catwayNumber
    });

    await newReservation.save();
    res.json(newReservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE reservation
router.put("/:idReservation", auth, async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(
      req.params.idReservation,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Reservation not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE reservation
router.delete("/:idReservation", auth, async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.idReservation);
    if (!deleted) return res.status(404).json({ error: "Reservation not found" });

    res.json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;