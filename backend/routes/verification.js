const express = require('express');
const router = express.Router();
const Verification = require('../models/Verification');
const Credential = require('../models/Credential');
const jwt = require('jsonwebtoken');

// Simple auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Business creates verification request
router.post('/request', auth, async (req, res) => {
  const { businessName, requestedData } = req.body;

  const requestId = 'VF-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const verification = await Verification.create({
    requestId,
    businessName,
    businessId: req.user.userId,
    requestedData,
    expiresAt
  });

  res.json({
    requestId,
    expiresAt
  });
});

// User approves verification
router.post('/approve/:requestId', auth, async (req, res) => {
  const verification = await Verification.findOne({ requestId: req.params.requestId });

  if (!verification) return res.status(404).json({ error: 'Not found' });

  const credential = await Credential.findOne({ userId: req.user.userId });

  if (!credential) return res.status(404).json({ error: 'No credential found' });

  verification.status = 'approved';
  verification.userId = req.user.userId;

  // Minimal shared data (ZKP-style)
  verification.sharedData = {
    ageVerified: true,
    ageRange: '18+',
    nationality: credential.data.nationality
  };

  verification.cryptographicProof = Math.random().toString(36).substring(2);
  verification.blockchainTxId = '#TX' + Math.floor(Math.random() * 100000);

  await verification.save();

  res.json({ success: true });
});

// Business checks status
router.get('/status/:requestId', auth, async (req, res) => {
  const verification = await Verification.findOne({ requestId: req.params.requestId });

  if (!verification) return res.status(404).json({ error: 'Not found' });

  res.json(verification);
});

module.exports = router;
