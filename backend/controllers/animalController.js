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
    const { name, age, breed, type, location, gender, size, description, price, phone, vaccinated, neutered } = req.body;
  const image = req.file ? req.file.path : '';

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
    vaccinated: vaccinated === 'true',
    neutered: neutered === 'true',
    image,
  });

  try {
    const newAnimal = await animal.save();
    res.status(201).json(newAnimal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
