# CSIC Backend - Deployment Guide

## Render Deployment Instructions

### 1. Prepare Environment Variables
Copy `.env.example` to `.env` and fill in the required values:
- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `FRONTEND_URL`: Your frontend deployment URL

### 2. Deploy to Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure the service:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18+
4. Add environment variables in Render dashboard
5. Deploy!

### 3. Database Setup
- Create a MongoDB Atlas cluster
- Whitelist Render's IP addresses (or use 0.0.0.0/0 for simplicity)
- Create a database user with read/write permissions

### 4. Frontend Configuration
Update your frontend to point to the new backend URL:
- Replace `http://localhost:5000` with your Render backend URL
- Update CORS settings if needed

### 5. Health Check
Your backend includes a health check endpoint at `/health`

## Local Development
```bash
npm install
npm run dev  # Uses nodemon if installed
# or
npm start   # Direct node execution
```

## Scripts
- `npm start` - Production server
- `npm run dev` - Development with auto-reload
- `npm run seed` - Seed database with test data