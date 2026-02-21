const express = require('express');
const router = express.Router();
const service = require('../services/users');
const auth = require('../middleware/auth');

router.post('/register', (req, res, next) => {
  return service.add(req, res, next);
});

router.post('/login', (req, res, next) => {
  return service.login(req, res, next);
});

router.get('/logout', (req, res, next) => {
  return service.logout(req, res, next);
});

router.post('/', (req, res, next) => {
  return service.add(req, res, next);
});

router.get('/me', auth, (req, res) => {
    console.log(">>> ROUTE /me APPELÉE !");
  return res.status(200).json({ user: req.user });
});

router.get('/', auth, (req, res, next) => {
  return service.getAll(req, res, next);
});

router.get('/:email', auth, (req, res, next) => {
  return service.getByEmail(req, res, next);
});

router.put('/:email', auth, (req, res, next) => {
  return service.update(req, res, next);
});

router.delete('/:email', auth, (req, res, next) => {
  return service.delete(req, res, next);
});

module.exports = router;