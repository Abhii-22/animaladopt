require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const animalRoutes = require('./routes/animalRoutes');
const kitRoutes = require('./routes/kitRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['https://animaladopt.vercel.app', 'https://animaladopt-pvi1.vercel.app', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.use('/api/animals', animalRoutes);
app.use('/api/kits', kitRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/auth', authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
