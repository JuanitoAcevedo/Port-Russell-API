const express = require('express');
const router = express.Router();

// GET /reservations/:catwayId
router.get('/:catwayId', (req, res) => {
  res.json({ message: 'reservations endpoint OK', catway: req.params.catwayId });
});

module.exports = router;