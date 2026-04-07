# Gmail Setup for Email Verification

## Problem
OTP verification codes are being generated and stored in the database, but emails are not being sent to users.

## Solution: Configure Gmail App Password

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left menu
3. Scroll down to "Signing in to Google" section
4. Enable "2-Step Verification" if it's not already enabled

### Step 2: Generate App Password
1. After enabling 2-Step Verification, go to: https://myaccount.google.com/apppasswords
2. Select "Mail" from the app dropdown
3. Select "Other (Custom name)" and type "Animal Adoption Platform"
4. Click "Generate"
5. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables
Update your `.env` file with the App Password:

```env
EMAIL_USER=pethomex79@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**Important**: Remove any spaces from the App Password when adding it to the .env file.

### Step 4: Restart Your Server
After updating the .env file, restart your backend server for the changes to take effect.

## Testing
The system will now:
1. Show the OTP in the console (for development)
2. Send the OTP via email to users
3. Continue working even if email fails (shows OTP in console)

## Current Status
- ✅ OTP generation works
- ✅ Database storage works
- ✅ Console display works
- ⚠️  Email sending needs Gmail App Password setup

## Troubleshooting
If emails still don't work after setup:
1. Double-check the App Password has no spaces
2. Ensure 2-Factor Authentication is enabled
3. Check that the email address is correct
4. Look at the server console for detailed error messages
