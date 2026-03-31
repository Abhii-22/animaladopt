const Animal = require('../models/Animal');

// Get all animals
exports.getAllAnimals = async (req, res) => {
  try {
    let query = {};
    if (req.query.type) {
      // If a 'type' query parameter is provided, add it to the query
      query.type = req.query.type;
    }
    const animals = await Animal.find(query);
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new animal
exports.createAnimal = async (req, res) => {
  const animal = new Animal(req.body);
  try {
    const newAnimal = await animal.save();
    res.status(201).json(newAnimal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Create a new animal with image upload
exports.uploadAnimal = async (req, res) => {
    try {
        console.log('=== Upload Animal Request ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('User ID:', req.user?.id);
        
        const { name, age, breed, type, location, gender, size, description, price, phone, email, vaccinated, neutered } = req.body;
        
        // Validate required fields
        if (!name || !breed || !type) {
            return res.status(400).json({ message: 'Name, breed, and type are required' });
        }
        
        let image = '';
        if (req.file) {
            console.log('File details:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path
            });
            
            // Check if it's a Cloudinary URL (full HTTP URL) or local path
            if (req.file.path && req.file.path.startsWith('http')) {
                // Cloudinary URL
                image = req.file.path;
                console.log('Using Cloudinary URL:', image);
            } else {
                // Local file - create relative path
                image = `/uploads/${req.file.filename}`;
                console.log('Using local path:', image);
            }
        } else {
            console.log('No file uploaded');
        }

        const animal = new Animal({
            name,
            age,
            breed,
            type,
            location,
            gender,
            size,
            description,
            price,
            phone,
            email,
            vaccinated: vaccinated === 'true',
            neutered: neutered === 'true',
            image,
            user: req.user.id
        });

        const newAnimal = await animal.save();
        console.log('Successfully saved animal:', newAnimal);
        res.status(201).json(newAnimal);
        
    } catch (err) {
        console.error('=== Upload Error ===');
        console.error('Error type:', err.constructor.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        
        // Handle specific errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation error: ' + messages.join(', ') });
        }
        
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Duplicate entry detected' });
        }
        
        res.status(500).json({ 
            message: 'Server error during upload. Please try again.',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Get user's animals
exports.getUserAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ user: req.user.id });
    res.status(200).json({
      status: 'success',
      data: {
        animals
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete animal
exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    
    // Check if the animal belongs to the current user
    if (animal.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this animal' });
    }
    
    await Animal.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Animal deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
