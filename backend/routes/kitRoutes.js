const express = require('express');
const router = express.Router();
const kitController = require('../controllers/kitController');

// GET all kit items
router.get('/', kitController.getAllKits);

// POST a new kit item
router.post('/', kitController.createKit);

module.exports = router;
