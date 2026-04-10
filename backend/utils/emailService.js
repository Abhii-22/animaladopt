const nodemailer = require('nodemailer');
const crypto = require('crypto');

const createTransporter = () => {
  // Check if we're in Vercel serverless environment
  const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
  
  const config = {
    host: 'smtp.gmail.com',
    port: isVercel ? 587 : 465, // Use 587 with STARTTLS for Vercel
    secure: isVercel ? false : true, // false for 587, true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: true, // Always enable debug for troubleshooting
    logger: true,
    connectionTimeout: 30000, // 30 seconds for serverless
    greetingTimeout: 15000,
    socketTimeout: 30000,
    // Add TLS configuration for Vercel
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    // Add pool configuration for serverless
    pool: false, // Disable pooling for serverless
    maxConnections: 1,
    rateDelta: 1000,
    rateLimit: 5
  };

  console.log('🔧 Email transporter config:', {
    hasUser: !!process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS,
    isVercel,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL,
    host: config.host,
    port: config.port,
    secure: config.secure
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
  const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
  console.log('🌍 Environment check:', { 
    isVercel, 
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL,
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS,
    emailUserPrefix: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 3) + '***' : 'missing'
  });
  
  // Quick check if email credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`⚠️  Email not configured - OTP: ${otp}`);
    if (isVercel) {
      console.log('🚨 VERCEL ENVIRONMENT: Email credentials missing! Check Vercel dashboard environment variables.');
      console.log('📋 Required variables: EMAIL_USER, EMAIL_PASS');
      console.log('🔧 Go to: Vercel Dashboard → Project → Settings → Environment Variables');
    }
    return false; // Return false to indicate failure
  }

  try {
    // Create transporter and verify connection first in Vercel
    const transporter = createTransporter();
    
    console.log('🔍 Creating transporter and verifying connection...');
    
    // Always verify connection before sending
    await transporter.verify();
    console.log('✅ Email connection verified successfully');
    
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

    // Send email with extended timeout for Vercel
    const timeout = 30000; // 30 seconds
    console.log('📧 Sending email...');
    
    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email timeout after 30 seconds')), timeout);
      })
    ]);
    
    console.log(`✅ Email sent successfully to ${email}`);
    console.log('📧 Email details:', {
      messageId: result.messageId,
      response: result.response,
      envelope: result.envelope
    });
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', {
      code: error.code,
      message: error.message,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    
    if (isVercel) {
      console.error('🚨 VERCEL EMAIL ERROR ANALYSIS:', {
        errorType: error.code,
        isAuthError: error.code === 'EAUTH' || error.code === 'EAUTHFAILED',
        isConnectionError: error.code === 'ECONNECTION',
        isTimeoutError: error.code === 'ETIMEDOUT',
        isGmailBlocking: error.responseCode === 550,
        suggestion: getErrorSuggestion(error)
      });
    }
    
    return false; // Return false to indicate failure
  }
};

const getErrorSuggestion = (error) => {
  switch (error.code) {
    case 'EAUTH':
    case 'EAUTHFAILED':
      return 'Check EMAIL_USER and EMAIL_PASS. Use App Password, not regular password.';
    case 'ECONNECTION':
      return 'Network connection failed. Try port 587 with STARTTLS.';
    case 'ETIMEDOUT':
      return 'Connection timeout. Gmail might be blocking Vercel IPs.';
    default:
      return 'Check Vercel function logs for more details.';
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
