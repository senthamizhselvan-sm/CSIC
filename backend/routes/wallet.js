const express = require('express');
const router = express.Router();
const Credential = require('../models/Credential');
const { auth, requireRole } = require('../middleware/auth');

const maskIdNumber = (idNumber) => {
  if (!idNumber || typeof idNumber !== 'string') {
    return 'XXXX-XXXX-XXXX';
  }

  const digits = idNumber.replace(/\D/g, '');
  const last4 = digits.slice(-4).padStart(4, 'X');
  return `XXXX-XXXX-${last4}`;
};

const maskDateOfBirth = () => '****-**-**';

// GET /api/wallet/credentials - Fetch user's credentials
router.get('/credentials', auth, requireRole('user'), async (req, res) => {
  try {
    const credentials = await Credential.find({ userId: req.user.userId })
      .sort({ verifiedAt: -1 })
      .lean();

    const response = credentials.map((credential) => ({
      _id: credential._id,
      type: credential.type,
      issuer: credential.issuer,
      verifiedAt: credential.verifiedAt,
      isActive: credential.isActive,
      expiresAt: credential.validUntil || credential.expiresAt
    }));

    res.json({ credentials: response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/wallet/add-credential - Add credential to wallet
router.post('/add-credential', auth, requireRole('user'), async (req, res) => {
  try {
    const { type, issuer, data } = req.body;

    const credential = await Credential.create({
      userId: req.user.userId,
      type: type || 'government_id',
      issuer,
      data,
      verifiedAt: new Date(),
      validUntil: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
      isActive: true
    });

    res.json({
      success: true,
      credential: {
        _id: credential._id,
        type: credential.type,
        issuer: credential.issuer,
        verifiedAt: credential.verifiedAt,
        isActive: credential.isActive,
        expiresAt: credential.validUntil || credential.expiresAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/credential/:credentialId', auth, requireRole('user'), async (req, res) => {
  try {
    const credential = await Credential.findOne({
      _id: req.params.credentialId,
      userId: req.user.userId
    }).lean();

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    return res.json({
      _id: credential._id,
      type: credential.type,
      issuer: credential.issuer,
      verifiedAt: credential.verifiedAt,
      isActive: credential.isActive,
      expiresAt: credential.validUntil || credential.expiresAt,
      data: {
        fullName: credential.data?.fullName,
        dateOfBirth: maskDateOfBirth(),
        nationality: credential.data?.nationality,
        idNumber: maskIdNumber(credential.data?.idNumber)
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete('/credential/:credentialId', auth, requireRole('user'), async (req, res) => {
  try {
    const credential = await Credential.findOne({
      _id: req.params.credentialId,
      userId: req.user.userId
    });

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    credential.isActive = false;
    await credential.save();

    return res.json({ success: true, message: 'Credential deactivated' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
