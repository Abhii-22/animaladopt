const mongoose = require('mongoose');

const kitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Toy', 'Accessory', 'Health']
  }
});

const Kit = mongoose.model('Kit', kitSchema);

module.exports = Kit;
