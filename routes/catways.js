const express = require('express');
const router = express.Router();
const service = require('../services/catways');

router.get('/', service.getAll);

module.exports = router;
