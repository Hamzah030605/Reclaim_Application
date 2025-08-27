# Google OAuth Setup Guide

## 🔧 Fix the "access_denied" Error

### Step 1: Get Your Supabase Project Reference

1. Go to your **Supabase Dashboard**
2. Look at the URL in your browser
3. It should look like: `https://app.supabase.com/project/abcdefgh-ijkl-mnop-qrst-uvwxyz123456`
4. Copy the project reference (the part after `/project/`)

### Step 2: Configure Google Cloud Console

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** (or create one)
3. **Enable APIs**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Search for "Google Identity" and enable it

4. **Create OAuth 2.0 Client**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name: "Reclaim App"
   - **Authorized redirect URIs** (add both):
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - Replace `YOUR_PROJECT_REF` with your actual project reference

5. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Reclaim"
     - User support email: your email
     - Developer contact information: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users: your email address
   - **Publish the app** (not in testing mode)

6. **Copy Client ID and Client Secret**:
   - Go back to "Credentials"
   - Click on your OAuth 2.0 Client ID
   - Copy the Client ID and Client Secret

### Step 3: Configure Supabase

1. **Go to Supabase Dashboard** → **Authentication** → **Providers**
2. **Find Google** and click "Edit"
3. **Enable Google provider**
4. **Enter your credentials**:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
   - Redirect URL: `http://localhost:3000/auth/callback`
5. **Save the configuration**

### Step 4: Test the Configuration

1. **Go to**: `http://localhost:3000/auth/test-google`
2. **Click "Test Google OAuth"**
3. **Check for specific errors**

### Common Issues & Solutions

#### Issue 1: "access_denied" Error
- **Cause**: OAuth client in testing mode or wrong redirect URIs
- **Solution**: 
  - Publish your OAuth app in Google Cloud Console
  - Ensure redirect URIs match exactly

#### Issue 2: "invalid_client" Error
- **Cause**: Wrong Client ID/Secret in Supabase
- **Solution**: Copy the correct credentials from Google Cloud Console

#### Issue 3: "redirect_uri_mismatch" Error
- **Cause**: Redirect URIs don't match between Google and Supabase
- **Solution**: Ensure both have the same redirect URIs

#### Issue 4: OAuth Consent Screen Not Configured
- **Cause**: Missing OAuth consent screen configuration
- **Solution**: Configure the OAuth consent screen in Google Cloud Console

### Verification Checklist

- [ ] Google Cloud Console OAuth client created
- [ ] Redirect URIs configured correctly
- [ ] OAuth consent screen published
- [ ] APIs enabled (Google+ API, Google Identity)
- [ ] Supabase Google provider enabled
- [ ] Client ID and Secret entered in Supabase
- [ ] Test user added (if in testing mode)

### Test URLs

- **Test Page**: `http://localhost:3000/auth/test-google`
- **Debug Info**: `http://localhost:3000/api/auth/debug?action=test-google`
- **Login Page**: `http://localhost:3000/auth/login`

### Next Steps

After fixing the configuration:
1. Test with the test page
2. Try logging in from the main login page
3. Check that users are created in your Supabase database
4. Verify that the callback route works correctly
