# Quick Setup Guide - Local Development

This guide will help you set up the MyGPT application for local development in about 15-20 minutes.

## Step 1: Prerequisites Check

Ensure you have these installed:
```bash
node --version  # Should be 20 or higher
npm --version   # Should be 6 or higher
git --version   # Any recent version
```

If any are missing, install them:
- [Node.js](https://nodejs.org/) (includes npm)
- [Git](https://git-scm.com/)

## Step 2: Get the API Keys

You'll need to create accounts and get API keys from these services. Do this first:

### 🔑 Google Gemini AI (Free tier available)
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" → "Create API Key"
4. Copy and save your API key ✅

### 🔐 Clerk Authentication (Free tier: 10,000 MAUs)
1. Visit [Clerk.com](https://clerk.com/)
2. Sign up for free
3. Create a new application
4. Copy these from your dashboard:
   - Publishable Key ✅
   - Secret Key ✅

### 📷 ImageKit (Free tier: 20GB storage, 20GB bandwidth)
1. Visit [ImageKit.io](https://imagekit.io/)
2. Sign up for free
3. Go to Developer → API Keys
4. Copy these values:
   - URL Endpoint ✅
   - Public Key ✅
   - Private Key ✅

### 🗄️ MongoDB (Free tier: 512MB)
**Option A: MongoDB Atlas (Recommended)**
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create a cluster (choose free tier)
4. Create database user
5. Add your IP to access list (or use 0.0.0.0/0 for testing)
6. Get connection string ✅

**Option B: Local MongoDB**
- Install MongoDB locally
- Use: `mongodb://localhost:27017/mygpt`

## Step 3: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd MyGPT-main

# Install all dependencies (frontend + backend)
npm run install
```

## Step 4: Configure Environment

### Backend Environment
Create `backend/.env`:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string_here
IMAGE_KIT_ENDPOINT=your_imagekit_endpoint_here
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key_here
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Frontend Environment
Create `client/.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_IMAGE_KIT_ENDPOINT=your_imagekit_endpoint_here
VITE_IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key_here
VITE_API_URL=http://localhost:5000
```

## Step 5: Configure Clerk URLs

In your Clerk dashboard:

1. Go to "Paths" or "Authentication" settings
2. Add these URLs:
   - **Sign-in URL**: `/sign-in`
   - **Sign-up URL**: `/sign-up`
   - **After sign-in URL**: `/dashboard`
   - **After sign-up URL**: `/dashboard`

3. Add these redirect URLs:
   - `http://localhost:5173/*`
   - `http://localhost:3000/*`

## Step 6: Run the Application

```bash
# Start both frontend and backend
npm run dev
```

This starts:
- Backend server: http://localhost:5000
- Frontend app: http://localhost:5173

## Step 7: Test Your Setup

1. Open http://localhost:5173
2. You should see the MyGPT homepage
3. Click "Get Started" to test authentication
4. Sign up/sign in using Clerk
5. Try sending a message to test Gemini AI
6. Try uploading an image to test ImageKit

## Troubleshooting Quick Fixes

### ❌ "MongoDB connection error"
- Check your MONGO_URL in backend/.env
- Ensure your IP is whitelisted in MongoDB Atlas
- Test connection string in MongoDB Compass

### ❌ "Clerk authentication failed"
- Verify CLERK keys in both backend/.env and client/.env
- Check redirect URLs in Clerk dashboard
- Ensure keys don't have extra spaces

### ❌ "Gemini API error"
- Verify VITE_GEMINI_API_KEY in client/.env
- Check API key permissions in Google AI Studio
- Ensure you have quota remaining

### ❌ "ImageKit upload failed"
- Verify all ImageKit keys in both .env files
- Check ImageKit dashboard for usage limits
- Ensure URL endpoint includes https://

### ❌ "CORS error"
- Ensure CLIENT_URL is set correctly in backend/.env
- Check that frontend is running on port 5173
- Restart both servers after changing environment variables

## Development Commands

```bash
# Install dependencies
npm run install

# Start development (both servers)
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend  
npm run dev:frontend

# Lint frontend code
npm run lint

# Clean dependencies
npm run clean
```

## File Structure Overview

```
MyGPT-main/
├── backend/
│   ├── .env                 # ← Create this file
│   ├── index.js            # Server code
│   └── models/             # Database models
├── client/
│   ├── .env                # ← Create this file
│   ├── src/                # React components
│   └── public/             # Static assets
└── package.json            # Root dependencies
```

## Next Steps

Once everything is working:

1. **Customize the app**: Modify colors, branding, and features
2. **Deploy**: Use the included deployment scripts for production
3. **Monitor**: Set up logging and monitoring for production use
4. **Scale**: Upgrade API plans as your usage grows

## Need Help?

1. Check the main [README.md](README.md) for detailed documentation
2. Review error messages in browser console and terminal
3. Verify all environment variables are set correctly
4. Ensure all services (MongoDB, Clerk, etc.) are accessible

**Estimated setup time**: 15-20 minutes (including account creation)
