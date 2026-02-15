const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const logger = require('./middleware/logger');
const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const credentialsRoutes = require('./routes/credentials');
const verificationRoutes = require('./routes/verification');
const businessRoutes = require('./routes/business');
const blockchainRoutes = require('./routes/blockchain');
const { cleanupExpiredVerifications } = require('./utils/cleanupExpired');

const app = express();
const server = http.createServer(app);

// Configure CORS for production and development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://your-frontend-domain.com', // Replace with actual domain
  process.env.FRONTEND_URL
].filter(Boolean);

const io = socketIo(server, {
  cors: { 
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io);

// middleware
app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(logger);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/credentials', credentialsRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/blockchain', blockchainRoutes);

// test route
app.get('/', (req, res) => {
  res.send('VerifyOnce API is running 🚀');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

// connect DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/csic')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

cleanupExpiredVerifications();
setInterval(cleanupExpiredVerifications, 60 * 1000);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down...`);
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      process.exit(0);
    });
  });

  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
