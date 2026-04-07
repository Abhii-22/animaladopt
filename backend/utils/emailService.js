const nodemailer = require('nodemailer');
const crypto = require('crypto');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: true,
    logger: true
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationOTP = async (email, name, otp) => {
  try {
    console.log(`📧 Attempting to send verification email to: ${email}`);
    console.log(`📧 Email user configured: ${process.env.EMAIL_USER ? 'YES' : 'NO'}`);
    console.log(`📧 Email pass configured: ${process.env.EMAIL_PASS ? 'YES' : 'NO'}`);
    
    // Always show OTP in console for development/testing
    console.log(`🔍 DEVELOPMENT - OTP for ${email}: ${otp}`);
    
    // Only skip email if credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`⚠️  Email not configured - Please set up Gmail credentials`);
      console.log(`📋 To fix email sending:`);
      console.log(`   1. Enable 2-Factor Authentication on your Gmail account`);
      console.log(`   2. Go to: https://myaccount.google.com/apppasswords`);
      console.log(`   3. Generate an App Password for "Mail"`);
      console.log(`   4. Use that App Password as EMAIL_PASS in your .env file`);
      return true;
    }

    console.log(`📧 Creating email transporter...`);
    const transporter = createTransporter();
    
    // Verify transporter connection
    await transporter.verify();
    console.log(`✅ Email transporter verified successfully`);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - Animal Adoption Platform',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
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
        </div>
      `
    };

    console.log(`📧 Sending email...`);
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification OTP:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log(`🔧 Gmail Authentication Error - Fix Steps:`);
      console.log(`   1. Make sure 2-Factor Authentication is enabled on your Gmail account`);
      console.log(`   2. Go to: https://myaccount.google.com/apppasswords`);
      console.log(`   3. Generate a new App Password for "Mail"`);
      console.log(`   4. Copy the 16-character password and use it as EMAIL_PASS`);
      console.log(`   5. Update your .env file with the new App Password`);
    }
    
    // Always show OTP for manual verification
    console.log(`🔧 EMAIL FAILED - Use this OTP for ${email}: ${otp}`);
    return true; // Allow signup to continue even if email fails
  }
};

const sendPasswordResetOTP = async (email, name, otp) => {
  try {
    console.log(`📧 Attempting to send password reset email to: ${email}`);
    
    // Always show OTP in console for development/testing
    console.log(`🔍 DEVELOPMENT - Password reset OTP for ${email}: ${otp}`);
    
    // Only skip email if credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`⚠️  Email not configured - Password reset OTP for ${email}: ${otp}`);
      return true;
    }

    const transporter = createTransporter();
    
    // Verify transporter connection
    await transporter.verify();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - Animal Adoption Platform',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
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
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset OTP:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log(`🔧 Gmail Authentication Error - See setup instructions above`);
    }
    
    // Always show OTP for manual verification
    console.log(`🔧 EMAIL FAILED - Password reset OTP for ${email}: ${otp}`);
    return true; // Allow reset to continue even if email fails
  }
};

module.exports = {
  generateOTP,
  sendVerificationOTP,
  sendPasswordResetOTP
};
