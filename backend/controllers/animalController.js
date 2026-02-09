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
    console.log('Request body:', req.body);
    const { name, age, breed, type, location, gender, size, description, price, phone, email, vaccinated, neutered } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

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
    user: req.user.id // Add current user ID
  });

  try {
    const newAnimal = await animal.save();
    console.log('Saved animal:', newAnimal);
    res.status(201).json(newAnimal);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
