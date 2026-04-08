const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('../backend/routes/authRoutes');
const animalRoutes = require('../backend/routes/animalRoutes');
const adoptionRoutes = require('../backend/routes/adoptionRoutes');
const kitRoutes = require('../backend/routes/kitRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://animaladopt.vercel.app', 'https://animaladopt-pvi1.vercel.app', 'https://animaladopt-3.onrender.com', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/kits', kitRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel: process.env.VERCEL ? 'true' : 'false'
  });
});

// Email test endpoint for debugging
app.post('/api/test-email', async (req, res) => {
  try {
    const { sendVerificationOTP, generateOTP } = require('../backend/utils/emailService');
    const { email = 'test@example.com', name = 'Test User' } = req.body;
    
    const otp = generateOTP();
    console.log('🧪 Testing email service...');
    
    // Log environment details
    const envDetails = {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL ? 'true' : 'false',
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      emailUserPrefix: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 3) + '***' : 'missing'
    };
    
    console.log('🔍 Environment details:', envDetails);
    
    const startTime = Date.now();
    const result = await sendVerificationOTP(email, name, otp);
    const endTime = Date.now();
    
    res.json({ 
      success: result, 
      otp,
      executionTime: `${endTime - startTime}ms`,
      environment: envDetails,
      timestamp: new Date().toISOString(),
      message: result ? 'Email sent successfully' : 'Email failed - check logs for details'
    });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.code || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Comprehensive debugging endpoint
app.get('/api/debug', (req, res) => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL ? 'true' : 'false',
      platform: process.platform,
      version: process.version
    },
    emailConfig: {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      emailUserPrefix: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 3) + '***' : 'missing'
    },
    database: {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'missing'
    },
    auth: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
    }
  };
  
  res.json(debugInfo);
});

module.exports = app;
