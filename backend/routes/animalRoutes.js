const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload directory and ensure it exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const router = express.Router();
const animalController = require('../controllers/animalController');

// GET all animals
router.get('/', animalController.getAllAnimals);

// POST a new animal
router.post('/', animalController.createAnimal);

// POST a new animal with image upload
router.post('/upload', upload.single('image'), animalController.uploadAnimal);

module.exports = router;
