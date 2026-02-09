const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  size: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  vaccinated: { type: Boolean, default: false },
  neutered: { type: Boolean, default: false },
  price: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  shelter: { type: String, default: 'Happy Paws Shelter' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Animal', animalSchema);
