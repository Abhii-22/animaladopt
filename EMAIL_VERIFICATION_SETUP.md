# Email Verification Setup Instructions

## Backend Configuration

1. **Install dependencies** (if not already installed):
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     # Email Configuration
     EMAIL_USER=your-gmail-address@gmail.com
     EMAIL_PASS=your-app-password-here
     ```

3. **Gmail App Password Setup**:
   - Enable 2-factor authentication on your Gmail account
   - Go to Google Account settings > Security > App passwords
   - Generate a new app password for "Mail"
   - Use this app password in the `EMAIL_PASS` field

4. **Start the backend server**:
   ```bash
   npm run dev
   ```

## Frontend Configuration

The frontend is already configured to work with the email verification system.

## How It Works

1. **User Registration**:
   - User fills out the signup form
   - Account is created with `emailVerified: false`
   - 6-digit OTP is generated and sent to user's email
   - User is redirected to OTP verification page

2. **Email Verification**:
   - User enters the 6-digit code
   - System validates the OTP and expiration (10 minutes)
   - On success, `emailVerified` is set to `true`
   - User is automatically logged in and redirected to home

3. **Login Security**:
   - Users cannot login until their email is verified
   - Clear error message shown for unverified accounts

4. **Resend OTP**:
   - Users can request a new verification code
   - Previous code is invalidated
   - New 10-minute expiration timer starts

## API Endpoints

- `POST /api/auth/signup` - Create account and send verification email
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-verification` - Resend verification code
- `POST /api/auth/login` - Login (requires verified email)

## Features

- ✅ 6-digit OTP verification
- ✅ 10-minute expiration timer
- ✅ Resend OTP functionality
- ✅ Beautiful email templates
- ✅ Auto-focus OTP inputs
- ✅ Paste support for OTP
- ✅ Error handling and user feedback
- ✅ Automatic login after verification
- ✅ Login protection for unverified accounts
