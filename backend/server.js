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
const { cleanupExpiredVerifications } = require('./utils/cleanupExpired');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: 'http://localhost:5173', credentials: true }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io);

// middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(logger);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/credentials', credentialsRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/business', businessRoutes);

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
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log(err));

cleanupExpiredVerifications();
setInterval(cleanupExpiredVerifications, 60 * 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
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
