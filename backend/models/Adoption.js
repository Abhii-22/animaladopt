const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  animalName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  vaccinated: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'online']
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
});

const Adoption = mongoose.model('Adoption', adoptionSchema);

module.exports = Adoption;
