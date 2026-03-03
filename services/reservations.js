const Reservation = require('../models/reservations');

exports.getAll = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().populate('catway');
    res.json(reservations);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('catway');
    if (!reservation) return res.status(404).json({ error: "reservation_not_found" });
    res.json(reservation);
  } catch (err) {
    next(err);
  }
};

exports.add = async (req, res, next) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "reservation_not_found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "reservation_not_found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};