# Vercel Deployment Guide - Email OTP Fix

## Problem
Email OTP works locally but fails on Vercel deployment.

## Root Cause
Vercel doesn't use your local `.env` file. You must configure environment variables in the Vercel dashboard.

## Solution: Configure Vercel Environment Variables

### Step 1: Go to Vercel Dashboard
1. Login to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" tab
4. Click on "Environment Variables" in the left menu

### Step 2: Add Required Environment Variables
Add each of these variables:

#### Email Configuration
```
EMAIL_USER = pethomex79@gmail.com
EMAIL_PASS = prnsfhrnxbqfwzqa
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
FRONTEND_URL = https://your-frontend-domain.vercel.app
```

### Step 3: Redeploy
After adding environment variables:
1. Go to "Deployments" tab
2. Click the three dots next to your latest deployment
3. Select "Redeploy"

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
