const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Try to use Cloudinary if available, otherwise fallback to local storage
let storage;
try {
  const cloudinaryConfig = require('../config/cloudinary');
  if (cloudinaryConfig.storage) {
    storage = cloudinaryConfig.storage;
    console.log('Using Cloudinary storage');
  } else {
    throw new Error('Cloudinary storage not available');
  }
} catch (error) {
  console.log('Cloudinary not configured, using local storage');
  
  // Fallback to local storage
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
}

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only 1 file allowed
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false);
    }
  }
});
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
router.post('/upload', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ message: 'Too many files. Only one file allowed.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ message: 'Unexpected file field. Use "image" field.' });
        }
        return res.status(400).json({ message: 'File upload error: ' + err.message });
      }
      
      return res.status(500).json({ message: 'Server error during file upload.' });
    }
    next();
  });
}, animalController.uploadAnimal);

// DELETE an animal (protected)
router.delete('/:id', protect, animalController.deleteAnimal);

module.exports = router;
