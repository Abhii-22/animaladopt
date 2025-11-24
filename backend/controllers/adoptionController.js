const Adoption = require('../models/Adoption');

// Create a new adoption application
exports.createAdoption = async (req, res) => {
  try {
    const { type, breed } = req.body;

    // Create a new adoption object with only type and breed from the request
    const newAdoption = new Adoption({
      type,
      breed,
      // Set other required fields to default or placeholder values
      animalName: 'N/A',
      vaccinated: 'No',
      price: 0,
      phone: '000-000-0000',
      email: 'placeholder@example.com',
      paymentMethod: 'cash' // Default payment method
    });

    await newAdoption.save();
    res.status(201).json({
      status: 'success',
      data: {
        adoption: newAdoption
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Get all adoption applications (optional, for admin purposes)
exports.getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find();
    res.status(200).json({
      status: 'success',
      results: adoptions.length,
      data: {
        adoptions
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
