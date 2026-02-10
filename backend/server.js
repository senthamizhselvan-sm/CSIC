const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
console.log('📝 Loading routes...');
const authRoutes = require('./routes/auth');
console.log('✅ Auth routes loaded');
const walletRoutes = require('./routes/wallet');
console.log('✅ Wallet routes loaded');
const verificationRoutes = require('./routes/verification');
console.log('✅ Verification routes loaded');

app.use('/api/auth', authRoutes);
console.log('✅ /api/auth registered');
app.use('/api/wallet', walletRoutes);
console.log('✅ /api/wallet registered');
app.use('/api/verification', verificationRoutes);
console.log('✅ /api/verification registered');

// test route
app.get('/', (req, res) => {
  res.send('VerifyOnce API is running 🚀');
});

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
