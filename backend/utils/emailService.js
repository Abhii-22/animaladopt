const nodemailer = require('nodemailer');
const crypto = require('crypto');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
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
    
    // Only skip email if credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`🔧 Email not configured - OTP for ${email}: ${otp}`);
      return true;
    }

    console.log(`📧 Creating email transporter...`);
    const transporter = createTransporter();
    
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
    console.error('❌ Full error:', error);
    
    // If email fails, log the OTP for manual verification
    console.log(`🔧 Email failed - OTP for ${email}: ${otp}`);
    return true; // Allow signup to continue even if email fails
  }
};

const sendPasswordResetOTP = async (email, name, otp) => {
  try {
    // Only skip email if credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`🔧 Email not configured - Password reset OTP for ${email}: ${otp}`);
      return true;
    }

    const transporter = createTransporter();
    
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
    console.error('❌ Error sending password reset OTP:', error);
    
    // If email fails, log the OTP for manual verification
    console.log(`🔧 Email failed - Password reset OTP for ${email}: ${otp}`);
    return true; // Allow reset to continue even if email fails
  }
};

module.exports = {
  generateOTP,
  sendVerificationOTP,
  sendPasswordResetOTP
};
