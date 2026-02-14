const express = require('express');
const router = express.Router();
const Credential = require('../models/Credential');
const { auth, requireRole } = require('../middleware/auth');

// POST /api/credentials/create - MVP: User Creates Verified Credential
router.post('/create', auth, requireRole('user'), async (req, res) => {
  try {
    const {
      type = 'aadhaar',
      fullName,
      dateOfBirth,
      nationality,
      aadhaarLast4,
      address
    } = req.body;

    // Validate required fields
    if (!fullName || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'fullName and dateOfBirth are required'
      });
    }

    // Check user doesn't already have active credential
    const existingActive = await Credential.findOne({
      userId: req.user.userId,
      isActive: true
    });

    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active credential'
      });
    }

    // Validate dateOfBirth is in the past
    const dob = new Date(dateOfBirth);
    if (dob > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth must be in the past'
      });
    }

    // FOR MVP: Accept data as-is (simulating Aadhaar verification)
    // FOR PRODUCTION: Would call DigiLocker/Aadhaar API here

    // Create credential
    const credential = await Credential.create({
      userId: req.user.userId,
      type,
      issuer: 'VerifyOnce Authority',
      data: {
        fullName,
        dateOfBirth: dob,
        nationality: nationality || null,
        aadhaarNumber: aadhaarLast4 ? `XXXX-XXXX-${aadhaarLast4}` : null,
        address: address || null
      },
      verifiedAt: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isActive: true
    });

    res.json({
      success: true,
      message: 'Identity verified and credential created',
      credential: {
        id: credential._id,
        type: credential.type,
        issuer: credential.issuer,
        fullName: credential.data.fullName,
        verifiedAt: credential.verifiedAt,
        validUntil: credential.validUntil,
        isActive: credential.isActive
      }
    });
  } catch (err) {
    console.error('Error creating credential:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create credential',
      error: err.message
    });
  }
});

// GET /api/credentials/my-credential - Get user's active credential
router.get('/my-credential', auth, requireRole('user'), async (req, res) => {
  try {
    const credential = await Credential.findOne({
      userId: req.user.userId,
      isActive: true
    });

    if (!credential) {
      return res.json({
        success: true,
        credential: null
      });
    }

    res.json({
      success: true,
      credential: {
        id: credential._id,
        type: credential.type,
        issuer: credential.issuer,
        fullName: credential.data.fullName,
        validUntil: credential.validUntil,
        isActive: credential.isActive,
        verifiedAt: credential.verifiedAt
      }
    });
  } catch (err) {
    console.error('Error fetching credential:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credential',
      error: err.message
    });
  }
});

// GET /api/credentials - Get all user credentials
router.get('/', auth, requireRole('user'), async (req, res) => {
  try {
    const credentials = await Credential.find({
      userId: req.user.userId
    }).sort({ verifiedAt: -1 });

    const response = credentials.map((credential) => ({
      _id: credential._id,
      type: credential.type,
      issuer: credential.issuer,
      fullName: credential.data?.fullName,
      nationality: credential.data?.nationality,
      dateOfBirth: credential.data?.dateOfBirth ? 'Present' : 'Missing',
      address: credential.data?.address ? 'Present' : 'Missing',
      verifiedAt: credential.verifiedAt,
      validUntil: credential.validUntil,
      isActive: credential.isActive
    }));

    res.json({
      success: true,
      credentials: response
    });
  } catch (err) {
    console.error('Error fetching credentials:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credentials',
      error: err.message
    });
  }
});

// GET /api/credentials/:id - Get credential details
router.get('/:id', auth, requireRole('user'), async (req, res) => {
  try {
    const credential = await Credential.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    res.json({
      success: true,
      credential: {
        _id: credential._id,
        type: credential.type,
        issuer: credential.issuer,
        fullName: credential.data?.fullName,
        dateOfBirth: credential.data?.dateOfBirth,
        nationality: credential.data?.nationality,
        address: credential.data?.address,
        aadhaarNumber: credential.data?.aadhaarNumber,
        verifiedAt: credential.verifiedAt,
        validUntil: credential.validUntil,
        isActive: credential.isActive,
        createdAt: credential.createdAt
      }
    });
  } catch (err) {
    console.error('Error fetching credential:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credential',
      error: err.message
    });
  }
});

// DELETE /api/credentials/:id - Revoke credential
router.delete('/:id', auth, requireRole('user'), async (req, res) => {
  try {
    const credential = await Credential.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    // Set isActive to false (soft delete)
    credential.isActive = false;
    await credential.save();

    res.json({
      success: true,
      message: 'Credential revoked successfully'
    });
  } catch (err) {
    console.error('Error revoking credential:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke credential',
      error: err.message
    });
  }
});

module.exports = router;
