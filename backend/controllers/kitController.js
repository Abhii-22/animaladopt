const Kit = require('../models/Kit');

// Get all kit items
exports.getAllKits = async (req, res) => {
  try {
    const kits = await Kit.find();
    res.json(kits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new kit item
exports.createKit = async (req, res) => {
  const kit = new Kit(req.body);
  try {
    const newKit = await kit.save();
    res.status(201).json(newKit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
