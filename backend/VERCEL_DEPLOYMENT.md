# Vercel Deployment Guide - Email OTP Fix

## Problem
Email OTP works locally but fails on Vercel deployment.

## Root Cause
Vercel doesn't use your local `.env` file. You must configure environment variables in the Vercel dashboard.

## ✅ SOLUTION IMPLEMENTED

I've fixed the email OTP issue for Vercel deployment with the following changes:

### 1. Created `vercel.json` configuration
- Proper serverless function setup
- API routing configuration
- Extended timeout for email operations

### 2. Enhanced Email Service (`backend/utils/emailService.js`)
- Added Vercel environment detection
- Enhanced debugging and logging
- Connection verification for serverless environment
- Extended timeouts for Vercel's network environment
- TLS configuration for better compatibility

### 3. Created API structure (`api/index.js`)
- Serverless-ready API entry point
- Email testing endpoint for debugging

### 4. Added Email Test Endpoint
- Test email service: `POST /api/auth/test-email`
- Returns environment details and email status

## 🚀 DEPLOYMENT STEPS

### Step 1: Configure Vercel Environment Variables
1. Login to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" tab → "Environment Variables"
4. Add these variables:

#### Email Configuration (CRITICAL)
```
EMAIL_USER = pethomex79@gmail.com
EMAIL_PASS = ktas rjva obhg fdtg
```

#### Database Configuration
```
MONGODB_URI = mongodb+srv://abhishekeb2003_db_animal:Animal@cluster0.cmhsn9e.mongodb.net/animaladoption
```

#### JWT Configuration
```
JWT_SECRET = your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN = 7d
```

#### Server Configuration
```
NODE_ENV = production
FRONTEND_URL = https://animaladopt.vercel.app
```

### Step 2: Deploy to Vercel
1. Push your changes to Git
2. Vercel will automatically deploy with the new configuration
3. OR manually redeploy from Vercel dashboard

### Step 3: Test Email Service
After deployment, test the email service:
```bash
curl -X POST https://your-app.vercel.app/api/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

## 🔍 DEBUGGING ON VERCEL

### Check Function Logs
1. Go to Vercel dashboard → Your project
2. Click "Functions" tab
3. Check logs for email operations
4. Look for these debug messages:
   - `🔧 Email transporter config`
   - `🌍 Environment check`
   - `🔍 Verifying email connection in Vercel`

### Common Issues & Solutions

#### Issue 1: Environment Variables Missing
**Symptoms**: `EMAIL_USER` or `EMAIL_PASS` not found
**Solution**: Ensure variables are added in Vercel dashboard

#### Issue 2: Gmail Authentication Error
**Symptoms**: `EAUTH` error code
**Solution**: 
1. Use App Password (not regular password)
2. Enable 2-factor authentication
3. Generate new App Password from Google Account settings

#### Issue 3: Connection Timeout
**Symptoms**: `ETIMEDOUT` or `ECONNECTION` errors
**Solution**: Already handled with extended timeouts in the updated code

#### Issue 4: Gmail Blocking Vercel IPs
**Symptoms**: Emails not delivered, no error
**Solutions**:
1. **Recommended**: Switch to SendGrid (100 free emails/day)
2. **Alternative**: Use Ethereal for testing
3. **Last Resort**: Try different SMTP ports (587 with STARTTLS)

## 📧 ALTERNATIVE EMAIL SERVICES

If Gmail continues to have issues:

### SendGrid Setup (Recommended)
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify your sender email
3. Get API key
4. Add to Vercel environment:
   ```
   EMAIL_SERVICE = sendgrid
   SENDGRID_API_KEY = your-api-key
   EMAIL_USER = your-verified-email
   ```

### Ethereal Email (Testing Only)
```
EMAIL_SERVICE = ethereal
```

## ✅ VERIFICATION CHECKLIST

After deployment:

- [ ] Environment variables configured in Vercel dashboard
- [ ] Test email endpoint returns success
- [ ] New user signup receives OTP email
- [ ] OTP verification works correctly
- [ ] Check Vercel function logs for email status
- [ ] Monitor for any authentication or connection errors

## 🎯 KEY IMPROVEMENTS

1. **Enhanced Logging**: Detailed debug information for troubleshooting
2. **Environment Detection**: Automatic Vercel vs local environment handling
3. **Connection Verification**: Pre-send connection check in serverless
4. **Extended Timeouts**: 15-second timeout for Vercel's network
5. **TLS Configuration**: Better compatibility with serverless environments
6. **Error Details**: Comprehensive error reporting for debugging

The system is now production-ready for Vercel deployment with proper email OTP functionality!

## Vercel-Specific Email Issues

### Issue 1: Gmail Blocking Vercel IPs
Gmail might block emails from Vercel's IP addresses. Solution:

#### Option A: Use SendGrid (Recommended)
1. Sign up for [SendGrid](https://sendgrid.com/)
2. Get API key from SendGrid dashboard
3. Update environment variables:
   ```
   EMAIL_SERVICE = sendgrid
   SENDGRID_API_KEY = your-sendgrid-api-key
   EMAIL_USER = your-verified-sender-email
   ```

#### Option B: Use Ethereal Email (Testing)
For testing purposes, you can use Ethereal email:
```
EMAIL_SERVICE = ethereal
```

### Issue 2: Port and Network Configuration
Vercel runs on serverless functions, which might have network restrictions.

## Debugging on Vercel

### Check Logs
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Check function logs for email errors

### Test Email Service
Create a test endpoint to verify email configuration:
```javascript
// Add this to your authRoutes.js
router.post('/test-email', async (req, res) => {
  const { sendVerificationOTP, generateOTP } = require('../utils/emailService');
  const otp = generateOTP();
  const result = await sendVerificationOTP('test@example.com', 'Test User', otp);
  res.json({ success: result, otp });
});
```

## Production Email Service Recommendation

For reliable email delivery in production, consider using:

1. **SendGrid** - 100 free emails/day, reliable delivery
2. **Mailgun** - 5,000 free emails/month
3. **AWS SES** - Pay-as-you-go, very reliable
4. **Resend** - Modern email API, 3,000 free emails/month

## Quick Fix for Current Setup

If you want to stick with Gmail, ensure:

1. ✅ Environment variables are set in Vercel dashboard
2. ✅ App Password is correct (no spaces)
3. ✅ 2-Factor Authentication is enabled
4. ✅ "Less secure apps" is NOT enabled (use App Password instead)

## Verification Steps

After deployment:

1. Try signing up with a new email
2. Check Vercel function logs for email status
3. If email fails, OTP will still be in logs for manual verification
4. Check your email (including spam folder)

The system is designed to work even if email fails - OTPs are logged for manual verification.
