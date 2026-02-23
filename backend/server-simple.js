require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationOTP, generateOTP } = require('./utils/emailService');
const db = require('./utils/fileDatabase');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://animaladopt.vercel.app', 'https://animaladopt-pvi1.vercel.app', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper functions
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    
    // Check if user already exists
    const existingUser = await db.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Generate OTP and set expiration
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const hashedPassword = await hashPassword(req.body.password);

    // Create user with OTP
    const newUser = await db.createUser({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      emailVerificationOTP: otp,
      emailVerificationExpires: otpExpires.toISOString(),
      emailVerified: false,
      role: 'user'
    });

    console.log('User created successfully:', newUser.email);

    // Send verification OTP
    const emailSent = await sendVerificationOTP(newUser.email, newUser.name, otp);
    
    if (!emailSent) {
      // If email fails, delete the user and return error
      await db.deleteOne({ email: newUser.email });
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send verification email. Please try again.'
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully. Please check your email for verification code.',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          emailVerified: false
        }
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password!'
      });
    }

    // Find user
    const user = await db.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Check password
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        status: 'error',
        message: 'Please verify your email before logging in'
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
});

app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and verification code'
      });
    }

    // Find user
    const user = await db.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already verified'
      });
    }

    // Check if OTP is correct and not expired
    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification code'
      });
    }

    if (Date.now() > new Date(user.emailVerificationExpires).getTime()) {
      return res.status(400).json({
        status: 'error',
        message: 'Verification code has expired'
      });
    }

    // Verify email and clear OTP fields
    await db.findByIdAndUpdate(user._id, {
      emailVerified: true,
      emailVerificationOTP: undefined,
      emailVerificationExpires: undefined
    });

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: true,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
});

app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email address'
      });
    }

    const user = await db.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with new OTP
    await db.findByIdAndUpdate(user._id, {
      emailVerificationOTP: otp,
      emailVerificationExpires: otpExpires.toISOString()
    });

    // Send verification OTP
    const emailSent = await sendVerificationOTP(user.email, user.name, otp);
    
    if (!emailSent) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send verification email. Please try again.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Verification code sent successfully. Please check your email.'
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Using file-based database for testing');
});
