const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register - Create User Wallet
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role = 'user', businessName } = req.body;

    // Validate businessName for verifier role
    if (role === 'verifier' && !businessName) {
      return res.status(400).json({ message: 'businessName required for verifier role' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    user = await User.create({
      name,
      email,
      password: hashed,
      role,
      phone,
      businessName: role === 'verifier' ? businessName : null
    });

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'dev_only_insecure_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login - Sign in to existing wallet
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        businessName: user.businessName 
      },
      process.env.JWT_SECRET || 'dev_only_insecure_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Demo User Login (Auto-create)
router.get('/demo-user', async (req, res) => {
  let user = await User.findOne({ email: 'demo@user.com' });

  if (!user) {
    const hashed = await bcrypt.hash('demo123', 10);
    user = await User.create({
      name: 'Demo User',
      email: 'demo@user.com',
      password: hashed,
      role: 'user'
    });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'dev_only_insecure_secret',
    { expiresIn: '1d' }
  );

  res.json({ token, user });
});

// Demo Business Login
router.get('/demo-business', async (req, res) => {
  let user = await User.findOne({ email: 'demo@business.com' });

  if (!user) {
    const hashed = await bcrypt.hash('demo123', 10);
    user = await User.create({
      name: 'Grand Hotel Mumbai',
      email: 'demo@business.com',
      password: hashed,
      role: 'business'
    });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'dev_only_insecure_secret',
    { expiresIn: '1d' }
  );

  res.json({ token, user });
});

module.exports = router;
