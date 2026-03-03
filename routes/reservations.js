const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservations");
const Catway = require("../models/catways");
const auth = require("../middleware/auth");
const ReservationService = require('../services/reservations');

// GET /reservations 
router.get("/", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.user) {
      filter.user = req.query.user;
    }
    // Filtrer par catway
    if (req.query.catway) {
      filter.catway = req.query.catway;
    }

    // Filtrer par date de début minimale
    if (req.query.startDate) {
      filter.startDate = { $gte: new Date(req.query.startDate) };
    }

    // Filtrer par date de fin maximale
    if (req.query.endDate) {
      filter.endDate = { $lte: new Date(req.query.endDate) };
    }

    // Filtrer par période complète
    if (req.query.from && req.query.to) {
      filter.startDate = { $gte: new Date(req.query.from) };
      filter.endDate = { $lte: new Date(req.query.to) };
    }

    const sort = req.query.sort || "startDate";
    const reservations = await Reservation.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("catway", "name");

    const total = await Reservation.countDocuments(filter);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      reservations
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /reservations/
router.get("/check", auth, async (req, res) => {
  try {
    const { catway, startDate, endDate } = req.query;

    if (!catway || !startDate || !endDate) {
      return res.status(400).json({ 
        message: "catway, startDate and endDate are required" 
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (start >= end) {
      return res.status(400).json({ message: "startDate must be before endDate" });
    }

    // Vérifier si le catway existe
    const catwayExists = await Catway.findById(catway);
    if (!catwayExists) {
      return res.status(404).json({ message: "Catway not found" });
    }

    // Vérifier les conflits
    const conflict = await Reservation.findOne({
      catway,
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    res.status(200).json({
      available: !conflict,
      conflict
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /reservations

router.post("/", auth, async (req, res) => {
  try {
    const { catway, startDate, endDate } = req.body;

    // Validation des dates
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (start >= end) {
      return res.status(400).json({ message: "startDate must be before endDate" });
    }

    const now = new Date();
    if (start < now) {
      return res.status(400).json({ message: "startDate cannot be in the past" });
    }

    // Vérifier catway
    const catwayExists = await Catway.findById(catway);
    if (!catwayExists) {
      return res.status(404).json({ message: "Catway not found" });
    }

    // Vérifier conflits
    const conflict = await Reservation.findOne({
      catway,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    });

    if (conflict) {
      return res.status(400).json({ message: "Catway already reserved for these dates" });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      catway,
      startDate,
      endDate
    });

    res.json(reservation);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /my-reservations
router.get("/my-reservations", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    const sort = req.query.sort || "startDate";
    const reservations = await Reservation.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("catway", "name")

    const total = await Reservation.countDocuments(filter);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      reservations
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /reservations/catway/:catwayId

router.get("/catway/:catwayId", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const catwayId = req.params.catwayId;

    // Vérifier que le catway existe
    const catwayExists = await Catway.findById(catwayId);
    if (!catwayExists) {
      return res.status(404).json({ message: "Catway not found" });
    }

    const filter = { catway: catwayId };

    // Filtres optionnels (dates)
    if (req.query.startDate) {
      filter.startDate = { $gte: new Date(req.query.startDate) };
    }

    if (req.query.endDate) {
      filter.endDate = { $lte: new Date(req.query.endDate) };
    }

    if (req.query.from && req.query.to) {
      filter.startDate = { $gte: new Date(req.query.from) };
      filter.endDate = { $lte: new Date(req.query.to) };
    }

    const sort = req.query.sort || "startDate";

    const reservations = await Reservation.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("user", "email username")
      .populate("catway", "name");

    const total = await Reservation.countDocuments(filter);

    res.status(200).json({
      catway: catwayId,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      reservations
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /reservations/period

router.get("/period", auth, async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        message: "from and to dates are required"
      });
    }

    const start = new Date(from);
    const end = new Date(to);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (start >= end) {
      return res.status(400).json({
        message: "from date must be before to date"
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      startDate: { $gte: start },
      endDate: { $lte: end }
    };

    const sort = req.query.sort || "startDate";

    const reservations = await Reservation.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("user", "email username")
      .populate("catway", "name");

    const total = await Reservation.countDocuments(filter);

    res.status(200).json({
      from,
      to,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      reservations
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /reservations/active aujourd'hui

router.get("/active", auth, async (req, res) => {
  try {
    const now = new Date();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      startDate: { $lte: now },
      endDate: { $gte: now }
    };

    const sort = req.query.sort || "startDate";

    const reservations = await Reservation.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("user", "email username")
      .populate("catway", "name");

    const total = await Reservation.countDocuments(filter);

    res.status(200).json({
      date: now,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      reservations
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /reservations/futures réservations

router.get("/upcoming", auth, async (req, res) => {
  try {
    const now = new Date();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      startDate: { $gt: now }
    };

    const sort = req.query.sort || "startDate";

    const reservations = await Reservation.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("user", "email username")
      .populate("catway", "name");

    const total = await Reservation.countDocuments(filter);

    res.status(200).json({
      now,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      reservations
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /reservations/réservations passées

router.get("/past", auth, async (req, res) => {
  try {
    const now = new Date();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      endDate: { $lt: now }
    };

    const sort = req.query.sort || "-endDate";

    const reservations = await Reservation.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("user", "email username")
      .populate("catway", "name");

    const total = await Reservation.countDocuments(filter);

    res.status(200).json({
      now,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      reservations
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /reservations/statistiques globales

router.get("/stats", auth, async (req, res) => {
  try {
    const now = new Date();

    // Total
    const total = await Reservation.countDocuments();

    // Actives aujourd'hui
    const active = await Reservation.countDocuments({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    // Futures
    const upcoming = await Reservation.countDocuments({
      startDate: { $gt: now }
    });

    // Passées
    const past = await Reservation.countDocuments({
      endDate: { $lt: now }
    });

    // Réservations par catway
    const byCatway = await Reservation.aggregate([
      {
        $group: {
          _id: "$catway",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "catways",
          localField: "_id",
          foreignField: "_id",
          as: "catway"
        }
      },
      { $unwind: "$catway" },
      {
        $project: {
          _id: 0,
          catwayId: "$catway._id",
          catwayName: "$catway.name",
          count: 1
        }
      }
    ]);

    res.status(200).json({
      generatedAt: now,
      total,
      active,
      upcoming,
      past,
      byCatway
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /reservations/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const { catway, startDate, endDate } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: not your reservation" });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      if (start >= end) {
        return res.status(400).json({ message: "startDate must be before endDate" });
      }

      const now = new Date();
      if (start < now) {
        return res.status(400).json({ message: "startDate cannot be in the past" });
      }
    }

    if (catway) {
      const catwayExists = await Catway.findById(catway);
      if (!catwayExists) {
        return res.status(404).json({ message: "Catway not found" });
      }
    }

    const newCatway = catway || reservation.catway;
    const newStart = startDate || reservation.startDate;
    const newEnd = endDate || reservation.endDate;

    const conflict = await Reservation.findOne({
      _id: { $ne: reservation._id },
      catway: newCatway,
      startDate: { $lte: newEnd },
      endDate: { $gte: newStart }
    });

    if (conflict) {
      return res.status(400).json({ message: "Catway already reserved for these dates" });
    }

    reservation.catway = newCatway;
    reservation.startDate = newStart;
    reservation.endDate = newEnd;

    await reservation.save();

    res.status(200).json(reservation);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /reservations/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("user", "email username")
      .populate("catway", "name");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /reservations/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: not your reservation" });
    }

    await reservation.deleteOne();

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;