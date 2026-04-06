require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists on startup
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Uploads directory created at:', uploadsPath);
}

const animalRoutes = require('./routes/animalRoutes');
const kitRoutes = require('./routes/kitRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['https://animaladopt.vercel.app', 'https://animaladopt-pvi1.vercel.app', 'https://animaladopt-3.onrender.com', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images with proper caching and error handling
app.use('/uploads', express.static(uploadsPath, {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint to check uploads directory
app.get('/debug/uploads', (req, res) => {
  const fs = require('fs');
  try {
    const files = fs.readdirSync(uploadsPath);
    res.json({ 
      uploadsPath, 
      fileCount: files.length,
      files: files.slice(0, 10) // Show first 10 files
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Cannot access uploads directory', 
      uploadsPath 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
