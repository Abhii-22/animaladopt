require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const animalRoutes = require('./routes/animalRoutes');
const kitRoutes = require('./routes/kitRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Database connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/animals', animalRoutes);
app.use('/api/kits', kitRoutes);
app.use('/api/adoptions', adoptionRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
