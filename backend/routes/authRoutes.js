const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-otp', authController.resendVerificationOTP);

// Email test endpoint for debugging
router.post('/test-email', async (req, res) => {
  try {
    const { sendVerificationOTP, generateOTP } = require('../utils/emailService');
    const { email = 'test@example.com', name = 'Test User' } = req.body;
    
    const otp = generateOTP();
    console.log('🧪 Testing email service...');
    
    const result = await sendVerificationOTP(email, name, otp);
    
    res.json({ 
      success: result, 
      otp,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL ? 'true' : 'false',
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS
      }
    });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.code || 'Unknown error'
    });
  }
});

module.exports = router;
