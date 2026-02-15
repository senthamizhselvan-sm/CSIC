# 🔥 Railway Backend CORS Fix - COMPLETE

## ❌ The Problem
```
Access to XMLHttpRequest at 'https://csic-production.up.railway.app/api/auth/login' 
from origin 'https://csic-eta.vercel.app' has been blocked by CORS policy
```

## ✅ The Solution
Updated `backend/server.js` with comprehensive CORS configuration:

### What Was Fixed:

1. **Enhanced CORS Configuration**
   - Added dynamic origin checking
   - Explicit preflight (OPTIONS) handling
   - Extended allowed headers
   - Increased maxAge for better performance

2. **Added Health Check Endpoint**
   - `/api/health` - Test CORS is working
   - Shows allowed origins
   - Confirms API is running

## 📝 Deployment Steps

### Option 1: Git Push (Recommended)
```bash
cd CSIC
git add .
git commit -m "🔥 Fix CORS for Vercel frontend"
git push
```
Railway will auto-deploy in ~2 minutes.

### Option 2: Manual Railway Deployment
1. Go to Railway Dashboard
2. Select your project
3. Click "Deploy" → "Redeploy"

## 🧪 Testing CORS

### Test 1: Health Check
Open in browser:
```
https://csic-production.up.railway.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "VerifyOnce API is running",
  "cors": "enabled",
  "allowedOrigins": [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://csic-eta.vercel.app"
  ],
  "timestamp": "2026-02-15T..."
}
```

### Test 2: Login from Vercel
1. Go to: https://csic-eta.vercel.app/login
2. Enter: demo@user.com / demo123
3. Should login successfully ✅

## 🔧 What Changed in server.js

### Before:
```javascript
app.use(cors({ 
  origin: allowedOrigins,
  credentials: true
}));
```

### After:
```javascript
app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  maxAge: 86400
}));

app.options('*', cors()); // Handle preflight
```

## ✅ Allowed Origins

The backend now accepts requests from:
- `http://localhost:5173` (Vite dev)
- `http://localhost:3000` (CRA dev)
- `https://csic-eta.vercel.app` (Production)
- Any URL in `FRONTEND_URL` environment variable

## 🚀 After Deployment

1. **Wait 2 minutes** for Railway to deploy
2. **Test health endpoint**: https://csic-production.up.railway.app/api/health
3. **Test login** from Vercel app
4. **Check Railway logs** for any errors

## 📊 Expected Flow

```
User Browser (Vercel)
    ↓ OPTIONS request (preflight)
Railway Backend
    ↓ Response with CORS headers
User Browser
    ↓ POST /api/auth/login
Railway Backend
    ↓ Login successful ✅
```

## 🐛 If Still Not Working

### Check Railway Logs:
1. Go to Railway Dashboard
2. Click on your project
3. Go to "Deployments" → Latest deployment
4. Check logs for errors

### Verify Environment Variables:
Make sure Railway has:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Your secret key
- `PORT` - 5000
- `FRONTEND_URL` - https://csic-eta.vercel.app (optional)

### Test Direct API Call:
```bash
curl -X POST https://csic-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://csic-eta.vercel.app" \
  -d '{"email":"demo@user.com","password":"demo123"}'
```

Should return user data, not CORS error.

## ✨ This Fix Handles:

- ✅ Preflight OPTIONS requests
- ✅ Actual POST/GET requests
- ✅ Credentials (cookies/auth headers)
- ✅ Multiple allowed origins
- ✅ All HTTP methods
- ✅ Custom headers

This is production-ready CORS configuration! 🎉
