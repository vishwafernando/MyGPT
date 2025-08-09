# Troubleshooting Guide - Local Development

This guide helps you resolve common issues when setting up and running MyGPT in local development.

## Quick Diagnostic Commands

Before troubleshooting, run these commands to check your setup:

```bash
# Check Node.js version (should be 20+)
node --version

# Check if dependencies are installed
npm list --depth=0

# Check if environment files exist
ls backend/.env client/.env

# Test backend health endpoint
curl http://localhost:5000/api/health
```

## Common Issues and Solutions

### 1. Installation Issues

#### ❌ "npm install" fails
**Symptoms:**
- Error messages during `npm run install`
- Missing packages or dependencies

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf backend/node_modules client/node_modules
npm run install

# Check Node.js version
node --version  # Should be 20+

# Try installing individually
cd backend && npm install
cd ../client && npm install
```

#### ❌ "concurrently not found"
**Symptoms:**
- Error when running `npm run dev`

**Solution:**
```bash
npm install concurrently --save-dev
```

### 2. Environment Configuration Issues

#### ❌ "Missing required environment variable"
**Symptoms:**
- Backend fails to start
- Error messages about missing environment variables

**Solutions:**
1. **Check if .env files exist:**
   ```bash
   ls backend/.env client/.env
   ```

2. **Create from examples:**
   ```bash
   cp backend/.env.example backend/.env
   cp client/.env.example client/.env
   ```

3. **Verify all required variables are set in backend/.env:**
   ```env
   MONGO_URL=your_mongodb_connection_string
   IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
   IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Verify frontend variables in client/.env:**
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_IMAGE_KIT_ENDPOINT=your_imagekit_endpoint
   VITE_IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
   ```

#### ❌ Environment variables not loading
**Symptoms:**
- Variables show as undefined in application

**Solutions:**
1. **Restart both servers** after changing .env files
2. **Check for spaces** around the = sign (should be `KEY=value`)
3. **Check for quotes** (usually not needed unless value contains spaces)
4. **Verify file location** (.env should be in backend/ and client/ directories)

### 3. Database Connection Issues

#### ❌ "MongoDB connection error"
**Symptoms:**
- Backend fails to start or connect to database
- Error: "MongoServerError" or "MongoNetworkError"

**Solutions:**

1. **MongoDB Atlas Issues:**
   ```bash
   # Check connection string format
   # Should be: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database_name
   
   # Common fixes:
   # - Replace <password> with actual password
   # - Ensure password doesn't contain special characters (use URL encoding)
   # - Add your IP to Atlas whitelist (0.0.0.0/0 for testing)
   # - Check cluster is running and accessible
   ```

2. **Local MongoDB Issues:**
   ```bash
   # Check if MongoDB is running
   mongosh  # Should connect successfully
   
   # Start MongoDB service (Linux/Mac)
   sudo systemctl start mongod
   
   # Start MongoDB service (Windows)
   net start MongoDB
   
   # Use connection string
   MONGO_URL=mongodb://localhost:27017/mygpt
   ```

3. **Test connection manually:**
   ```bash
   # Test with mongosh
   mongosh "your_connection_string"
   ```

### 4. Authentication Issues (Clerk)

#### ❌ "Clerk authentication failed"
**Symptoms:**
- Can't sign in or sign up
- Redirect errors after authentication
- "Clerk is not defined" errors

**Solutions:**

1. **Check Clerk Keys:**
   ```bash
   # Ensure both backend and frontend have correct keys
   # Backend needs: CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
   # Frontend needs: VITE_CLERK_PUBLISHABLE_KEY
   ```

2. **Check Clerk Dashboard Settings:**
   - **Allowed redirect URLs:**
     - `http://localhost:5173/*`
     - `http://localhost:3000/*`
   - **Sign-in URL:** `/sign-in`
   - **Sign-up URL:** `/sign-up`
   - **After sign-in URL:** `/dashboard`
   - **After sign-up URL:** `/dashboard`

3. **Clear browser data:**
   - Clear cookies and local storage
   - Try incognito/private browsing

#### ❌ Infinite redirect loops
**Solutions:**
1. Check redirect URLs in Clerk dashboard
2. Clear browser cache and cookies
3. Verify environment variables are correctly set

### 5. API Integration Issues

#### ❌ "Gemini API error"
**Symptoms:**
- Chat responses fail
- Error messages about API key or quota

**Solutions:**

1. **Check API Key:**
   ```bash
   # Verify key in client/.env
   # Should start with: AIzaSy...
   ```

2. **Check Google AI Studio:**
   - Verify API key is active
   - Check usage quotas
   - Ensure billing is set up (if required)

3. **Test API key:**
   ```bash
   # Test with curl
   curl -H "Content-Type: application/json" \
        -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
   ```

#### ❌ "ImageKit upload failed"
**Symptoms:**
- Image uploads don't work
- Error messages during file upload

**Solutions:**

1. **Check ImageKit credentials:**
   ```bash
   # Verify all three values are set:
   # IMAGE_KIT_ENDPOINT (should start with https://ik.imagekit.io/)
   # IMAGE_KIT_PUBLIC_KEY
   # IMAGE_KIT_PRIVATE_KEY
   ```

2. **Check ImageKit dashboard:**
   - Verify account is active
   - Check usage limits
   - Verify CORS settings

### 6. CORS and Network Issues

#### ❌ "Blocked by CORS policy"
**Symptoms:**
- Frontend can't connect to backend
- Network errors in browser console

**Solutions:**

1. **Check backend CORS configuration:**
   ```javascript
   // Ensure CLIENT_URL in backend/.env matches frontend URL
   CLIENT_URL=http://localhost:5173
   ```

2. **Check both servers are running:**
   ```bash
   # Backend should be on http://localhost:5000
   curl http://localhost:5000/api/health
   
   # Frontend should be on http://localhost:5173
   curl http://localhost:5173
   ```

3. **Restart both servers** after changing CORS settings

#### ❌ "Connection refused" or "Network error"
**Solutions:**
1. Check if backend is running on correct port (5000)
2. Check if frontend proxy is configured correctly (vite.config.js)
3. Check firewall settings
4. Try different ports if conflicts exist

### 7. Development Server Issues

#### ❌ "Port already in use"
**Symptoms:**
- Error: "EADDRINUSE: address already in use :::5000"

**Solutions:**
```bash
# Find and kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9

# Or use different port in backend/.env
PORT=5001
```

#### ❌ "Frontend not loading"
**Symptoms:**
- Blank page or loading errors
- Vite server issues

**Solutions:**
```bash
# Clear Vite cache
cd client
rm -rf node_modules/.vite
npm run dev

# Try different port
npm run dev -- --port 3000

# Check for JavaScript errors in browser console
```

## Advanced Debugging

### Enable Debug Logging

1. **Backend debugging:**
   ```javascript
   // Add to backend/index.js
   console.log('Environment variables:', {
     NODE_ENV: process.env.NODE_ENV,
     PORT: process.env.PORT,
     CLIENT_URL: process.env.CLIENT_URL,
     // Don't log sensitive keys
   });
   ```

2. **Frontend debugging:**
   ```javascript
   // Add to client/src/main.jsx
   console.log('Frontend environment:', {
     NODE_ENV: import.meta.env.MODE,
     API_URL: import.meta.env.VITE_API_URL,
     // Don't log sensitive keys
   });
   ```

### Check Server Logs

```bash
# PM2 logs
pm2 logs mygpt-backend

# Node.js logs
node backend/index.js

# Check specific log files
tail -f logs/combined.log
tail -f logs/err.log
```

### Network Debugging

```bash
# Test API endpoints
curl -v http://localhost:5000/api/health
curl -v http://localhost:5000/api/upload

# Test with authentication
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
     http://localhost:5000/api/userchats
```

## Getting Help

If these solutions don't resolve your issue:

1. **Check existing issues** in the GitHub repository
2. **Create a new issue** with:
   - Detailed error message
   - Steps to reproduce
   - Your environment (OS, Node.js version, etc.)
   - Console output/logs
3. **Include relevant configuration** (without sensitive keys)

## Prevention Tips

- Always check environment variables after updates
- Keep dependencies updated regularly
- Test in both development and production environments
- Monitor application logs regularly
- Keep API keys secure and rotate them periodically
- Use version control for configuration changes
