const nodemailer = require('nodemailer');
const crypto = require('crypto');

const createTransporter = () => {
  // Check if we're in Vercel serverless environment
  const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
  
  const config = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: isVercel, // Enable debug in production for troubleshooting
    logger: isVercel,
    connectionTimeout: isVercel ? 10000 : 5000, // Longer timeout for serverless
    greetingTimeout: isVercel ? 5000 : 3000,
    socketTimeout: isVercel ? 10000 : 5000,
    // Add TLS configuration for Vercel
    tls: {
      rejectUnauthorized: false
    }
  };

  console.log('🔧 Email transporter config:', {
    hasUser: !!process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS,
    isVercel,
    host: config.host,
    port: config.port
  });

  return nodemailer.createTransport(config);
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationOTP = async (email, name, otp) => {
  // Always show OTP immediately for fast access
  console.log(`🔍 OTP for ${email}: ${otp}`);
  
  // Enhanced environment check
  const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
  console.log('🌍 Environment check:', { 
    isVercel, 
    nodeEnv: process.env.NODE_ENV,
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS
  });
  
  // Quick check if email credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`⚠️  Email not configured - OTP: ${otp}`);
    if (isVercel) {
      console.log('🚨 VERCEL ENVIRONMENT: Email credentials missing! Check Vercel dashboard environment variables.');
    }
    return true;
  }

  try {
    // Create transporter and verify connection first in Vercel
    const transporter = createTransporter();
    
    // In Vercel, verify connection before sending
    if (isVercel) {
      console.log('🔍 Verifying email connection in Vercel...');
      await transporter.verify();
      console.log('✅ Email connection verified');
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - Animal Adoption Platform',
      html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #28a745; margin-bottom: 20px;">Welcome to Animal Adoption Platform!</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
              Hi ${name},<br>
              Thank you for signing up! Please use the verification code below to verify your email address:
            </p>
            <div style="background-color: #fff; border: 2px solid #28a745; border-radius: 8px; padding: 20px; margin: 20px auto; max-width: 200px;">
              <span style="font-size: 32px; font-weight: bold; color: #28a745; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This code will expire in 10 minutes.<br>
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>`
    };

    // Send email with longer timeout for Vercel
    const timeout = isVercel ? 15000 : 8000;
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), timeout))
    ]);
    
    console.log(`✅ Email sent to ${email}`);
    return true;
  } catch (error) {
    console.log(`❌ Email failed:`, {
      code: error.code,
      message: error.message,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    if (isVercel) {
      console.log('🚨 VERCEL EMAIL ERROR DETAILS:', {
        errorType: error.code,
        isAuthError: error.code === 'EAUTH',
        isConnectionError: error.code === 'ECONNECTION',
        isTimeoutError: error.code === 'ETIMEDOUT'
      });
    }
    
    return true; // Continue even if email fails
  }
};

const sendPasswordResetOTP = async (email, name, otp) => {
  // Always show OTP immediately
  console.log(`🔍 Password reset OTP for ${email}: ${otp}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return true;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - Animal Adoption Platform',
      html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #dc3545; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
              Hi ${name},<br>
              We received a request to reset your password. Use the code below to proceed:
            </p>
            <div style="background-color: #fff; border: 2px solid #dc3545; border-radius: 8px; padding: 20px; margin: 20px auto; max-width: 200px;">
              <span style="font-size: 32px; font-weight: bold; color: #dc3545; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This code will expire in 10 minutes.<br>
              If you didn't request this code, please secure your account immediately.
            </p>
          </div>
        </div>`
    };

    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 8000))
    ]);
    
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.log(`❌ Password reset email failed: ${error.code || error.message}`);
    return true;
  }
};

module.exports = {
  generateOTP,
  sendVerificationOTP,
  sendPasswordResetOTP
};
