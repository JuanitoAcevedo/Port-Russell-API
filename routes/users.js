const express = require('express');
const router = express.Router();
const service = require('../services/users');

router.get('/', service.getAll);
router.get('/:email', service.getByEmail);
router.post('/', service.add);
router.put('/:email', service.update);
router.delete('/:email', service.delete);

router.post('/login', service.login);
router.get('/logout', service.logout);

module.exports = router;
