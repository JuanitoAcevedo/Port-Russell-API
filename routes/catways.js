const express = require('express');
const router = express.Router();
const service = require('../services/catways');
const auth = require('../middleware/auth');

// GET all catways
router.get('/', auth, (req, res, next) => {
  return service.getAll(req, res, next);
});

// ADD a new catway
router.post('/', auth, (req, res, next) => {
  return service.add(req, res, next);
});

// UPDATE a catway
router.put('/:id', auth, (req, res, next) => {
  return service.update(req, res, next);
});

// DELETE a catway
router.delete('/:id', auth, (req, res, next) => {
  return service.delete(req, res, next);
});

// GET one catway by number
router.get('/:number', auth, (req, res, next) => {
  return service.getByNumber(req, res, next);
});

module.exports = router;