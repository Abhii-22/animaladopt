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
const { protect } = require('../controllers/authController');

// GET all animals
router.get('/', animalController.getAllAnimals);

// GET user's animals (protected)
router.get('/my-pets', protect, animalController.getUserAnimals);

// POST a new animal (protected)
router.post('/', protect, animalController.createAnimal);

// POST a new animal with image upload (protected)
router.post('/upload', protect, upload.single('image'), animalController.uploadAnimal);

// DELETE an animal (protected)
router.delete('/:id', protect, animalController.deleteAnimal);

module.exports = router;
