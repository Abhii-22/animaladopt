const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');

// POST a new adoption application
router.post('/', adoptionController.createAdoption);

// GET all adoption applications
router.get('/', adoptionController.getAllAdoptions);

module.exports = router;
