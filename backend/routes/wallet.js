const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Credential = require('../models/Credential');

// Middleware: Verify JWT and attach user to request
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET /api/wallet/credentials - Fetch user's credentials
router.get('/credentials', authMiddleware, async (req, res) => {
  try {
    const credentials = await Credential.find({ userId: req.userId });
    res.json({ credentials });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/wallet/add-credential - Add credential to wallet
router.post('/add-credential', authMiddleware, async (req, res) => {
  try {
    const { type, issuer, data } = req.body;

    const credential = await Credential.create({
      userId: req.userId,
      type,
      issuer,
      data,
      verifiedAt: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    });

    res.json({
      message: 'Credential added to wallet',
      credential
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
