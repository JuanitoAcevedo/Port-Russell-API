const express = require("express");
const router = express.Router({ mergeParams: true });
const Reservation = require("../models/reservations");
const Catway = require("../models/catways");
const { auth } = require("../middleware/auth");

/**
 * @route GET /catways/:id/reservations
 * @description Récupère toutes les réservations associées à un catway
 * @access Private (token requis)
 * @param {Number} req.params.id - Numéro du catway
 * @returns {Array<Object>} Liste des réservations du catway
 */
router.get("/", auth, async (req, res) => {
  try {
    const catwayNumber = req.params.id;

    const reservations = await Reservation.find({ catwayNumber });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route GET /catways/:id/reservations/:idReservation
 * @description Récupère une réservation spécifique d’un catway
 * @access Private (token requis)
 * @param {String} req.params.idReservation - ID de la réservation
 * @returns {Object} Réservation correspondante
 */
router.get("/:idReservation", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route POST /catways/:id/reservations
 * @description Crée une réservation pour un catway donné
 * @access Private (token requis)
 * @param {Number} req.params.id - Numéro du catway
 * @body {String} boatName - Nom du bateau
 * @body {String} clientName - Nom du client
 * @body {Date} startDate - Date de début
 * @body {Date} endDate - Date de fin
 * @returns {Object} Réservation créée
 */
router.post("/", auth, async (req, res) => {
  try {
    const catwayNumber = req.params.id;

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

/**
 * @route PUT /catways/:id/reservations/:idReservation
 * @description Met à jour une réservation d’un catway
 * @access Private (token requis)
 * @param {String} req.params.idReservation - ID de la réservation
 * @returns {Object} Réservation mise à jour
 */
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

/**
 * @route DELETE /catways/:id/reservations/:idReservation
 * @description Supprime une réservation d’un catway
 * @access Private (token requis)
 * @param {String} req.params.idReservation - ID de la réservation à supprimer
 * @returns {Object} Message de confirmation
 */
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