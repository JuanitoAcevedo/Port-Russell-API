const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservations");
const { auth } = require("../middleware/auth");

/**
 * @route GET /reservations
 * @description Récupère la liste complète des réservations
 * @access Private (token requis)
 * @returns {Array<Object>} Liste des réservations
 */
router.get("/", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route GET /reservations/:id
 * @description Récupère une réservation selon son ID
 * @access Private (token requis)
 * @param {String} req.params.id - ID de la réservation
 * @returns {Object} Réservation correspondante
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route POST /reservations
 * @description Crée une nouvelle réservation
 * @access Private (token requis)
 * @body {String} boatName - Nom du bateau
 * @body {String} clientName - Nom du client
 * @body {Date} startDate - Date de début
 * @body {Date} endDate - Date de fin
 * @body {Number} catwayNumber - Numéro du catway réservé
 * @returns {Object} Réservation créée
 */
router.post("/", auth, async (req, res) => {
  try {
    const { boatName, clientName, startDate, endDate, catwayNumber } = req.body;

    if (!boatName || !clientName || !startDate || !endDate || !catwayNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }

    const overlap = await Reservation.findOne({
      catwayNumber,
      startDate: { $lt: endDate },
      endDate: { $gt: startDate }
    });

    if (overlap) {
      return res.status(400).json({ error: "Catway already reserved for these dates" });
    }

    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.json(newReservation);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route PUT /reservations/:id
 * @description Met à jour une réservation existante
 * @access Private (token requis)
 * @param {String} req.params.id - ID de la réservation à modifier
 * @body {String} boatName - Nom du bateau
 * @body {String} clientName - Nom du client
 * @body {Date} startDate - Nouvelle date de début
 * @body {Date} endDate - Nouvelle date de fin
 * @body {Number} catwayNumber - Numéro du catway réservé
 * @returns {Object} Réservation mise à jour
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { boatName, clientName, startDate, endDate, catwayNumber } = req.body;

    if (!boatName || !clientName || !startDate || !endDate || !catwayNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }

    const overlap = await Reservation.findOne({
      _id: { $ne: req.params.id },
      catwayNumber,
      startDate: { $lt: endDate },
      endDate: { $gt: startDate }
    });

    if (overlap) {
      return res.status(400).json({ error: "Catway already reserved for these dates" });
    }

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

/**
 * @route DELETE /reservations/:id
 * @description Supprime une réservation selon son ID
 * @access Private (token requis)
 * @param {String} req.params.id - ID de la réservation à supprimer
 * @returns {Object} Message de confirmation
 */
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