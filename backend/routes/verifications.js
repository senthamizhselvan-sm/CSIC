const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Verification = require('../models/Verification');
const Proof = require('../models/Proof');
const Credential = require('../models/Credential');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateRandomId = (length) => {
  const bytes = crypto.randomBytes(length);
  let output = '';
  for (let i = 0; i < length; i += 1) {
    output += CHARS[bytes[i] % CHARS.length];
  }
  return output;
};

const generateRequestId = async () => {
  let requestId;
  let exists = true;
  while (exists) {
    requestId = `VF-${generateRandomId(6)}`;
    // eslint-disable-next-line no-await-in-loop
    exists = await Verification.exists({ requestId });
  }
  return requestId;
};

const generateProofId = async () => {
  let proofId;
  let exists = true;
  while (exists) {
    proofId = `PROOF-${generateRandomId(8)}`;
    // eslint-disable-next-line no-await-in-loop
    exists = await Proof.exists({ proofId });
  }
  return proofId;
};

const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return null;
  }

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age;
};

// BUSINESS: Create verification request
router.post('/request', auth, requireRole('business'), async (req, res) => {
  try {
    const { businessName, requestedData } = req.body;

    if (!businessName || !requestedData || requestedData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'businessName and requestedData are required'
      });
    }

    const requestId = await generateRequestId();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const verification = await Verification.create({
      requestId,
      businessName,
      verifierId: req.user.userId,
      requestedData,
      status: 'pending',
      expiresAt
    });

    return res.json({
      success: true,
      requestId: verification.requestId,
      expiresAt: verification.expiresAt,
      message: 'Verification request created successfully'
    });
  } catch (err) {
    console.error('❌ Error creating verification request:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create verification request',
      error: err.message
    });
  }
});

// USER: View verification request details
router.get('/request/:requestId', auth, requireRole('user'), async (req, res) => {
  try {
    const verification = await Verification.findOne({
      requestId: req.params.requestId
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if expired
    const now = new Date();
    if (verification.status === 'pending' && now > verification.expiresAt) {
      verification.status = 'expired';
      await verification.save();
      return res.status(400).json({
        success: false,
        message: 'Request has expired'
      });
    }

    // Check status
    if (verification.status !== 'pending') {
      const statusMessages = {
        approved: 'Request already approved',
        rejected: 'Request already rejected',
        expired: 'Request has expired',
        revoked: 'Request has been revoked'
      };

      return res.status(400).json({
        success: false,
        message: statusMessages[verification.status] || 'Request already processed'
      });
    }

    return res.json({
      success: true,
      request: {
        requestId: verification.requestId,
        businessName: verification.businessName,
        requestedData: verification.requestedData,
        expiresAt: verification.expiresAt,
        status: verification.status
      }
    });
  } catch (err) {
    console.error('❌ Error fetching request details:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch request details',
      error: err.message
    });
  }
});

// USER: Approve verification request
router.post('/approve/:requestId', auth, requireRole('user'), async (req, res) => {
  try {
    const verification = await Verification.findOne({
      requestId: req.params.requestId
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check status is pending
    if (verification.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request already processed'
      });
    }

    // Check expiration
    const now = new Date();
    if (now > verification.expiresAt) {
      verification.status = 'expired';
      await verification.save();
      return res.status(400).json({
        success: false,
        message: 'Request has expired'
      });
    }

    // Get user's active credential
    const credential = await Credential.findOne({
      userId: req.user.userId,
      isActive: true
    });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'No active credential found'
      });
    }

    // Check credential not expired
    if (credential.validUntil && now > credential.validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Your credential has expired'
      });
    }

    // Generate proof data with ONLY requested fields
    const sharedData = {};

    for (const dataType of verification.requestedData) {
      if (dataType === 'age') {
        const age = calculateAge(credential.data?.dateOfBirth);
        if (age !== null) {
          sharedData.ageVerified = age >= 18;
          sharedData.age = age;
        }
      }

      if (dataType === 'nationality') {
        sharedData.nationality = credential.data?.nationality || 'Not provided';
      }

      if (dataType === 'fullName') {
        sharedData.fullName = credential.data?.fullName;
      }

      if (dataType === 'address') {
        sharedData.address = credential.data?.address || 'Not provided';
      }

      if (dataType === 'identity') {
        sharedData.identityVerified = true;
      }
    }

    // Create proof
    const proofId = await generateProofId();
    const proofExpiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

    const proof = await Proof.create({
      proofId,
      userId: req.user.userId,
      verifierId: verification.verifierId,
      verificationId: verification._id,
      businessName: verification.businessName,
      sharedData,
      expiresAt: proofExpiresAt
    });

    // Update verification status
    verification.status = 'approved';
    verification.userId = req.user.userId;
    await verification.save();

    return res.json({
      success: true,
      message: 'Request approved successfully',
      proof: {
        proofId: proof.proofId,
        sharedData: proof.sharedData,
        expiresAt: proof.expiresAt
      }
    });
  } catch (err) {
    console.error('❌ Error approving verification:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

// USER: Reject verification request
router.post('/reject/:requestId', auth, requireRole('user'), async (req, res) => {
  try {
    const verification = await Verification.findOne({
      requestId: req.params.requestId
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check status is pending
    if (verification.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request already processed'
      });
    }

    // Check expiration
    const now = new Date();
    if (now > verification.expiresAt) {
      verification.status = 'expired';
      await verification.save();
      return res.status(400).json({
        success: false,
        message: 'Request has expired'
      });
    }

    // Update status to rejected
    verification.status = 'rejected';
    verification.userId = req.user.userId;
    await verification.save();

    return res.json({
      success: true,
      message: 'Request rejected'
    });
  } catch (err) {
    console.error('❌ Error rejecting verification:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject verification',
      error: err.message
    });
  }
});

// USER: Get active proofs
router.get('/my-proofs', auth, requireRole('user'), async (req, res) => {
  try {
    const now = new Date();

    // Find all active proofs that haven't expired and aren't revoked
    const proofs = await Proof.find({
      userId: req.user.userId,
      revoked: false,
      expiresAt: { $gt: now }
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      proofs: proofs.map((proof) => ({
        proofId: proof.proofId,
        businessName: proof.businessName,
        sharedData: proof.sharedData,
        createdAt: proof.createdAt,
        expiresAt: proof.expiresAt
      }))
    });
  } catch (err) {
    console.error('❌ Error fetching proofs:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch proofs',
      error: err.message
    });
  }
});

// USER: Revoke proof
router.post('/proofs/revoke/:proofId', auth, requireRole('user'), async (req, res) => {
  try {
    const proof = await Proof.findOne({ proofId: req.params.proofId });

    if (!proof) {
      return res.status(404).json({
        success: false,
        message: 'Proof not found'
      });
    }

    // Check ownership
    if (proof.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Check not already revoked
    if (proof.revoked) {
      return res.status(400).json({
        success: false,
        message: 'Proof already revoked'
      });
    }

    // Revoke the proof
    proof.revoked = true;
    proof.revokedAt = new Date();
    await proof.save();

    // Update verification status to revoked
    const verification = await Verification.findById(proof.verificationId);
    if (verification) {
      verification.status = 'revoked';
      await verification.save();
    }

    return res.json({
      success: true,
      message: 'Proof revoked successfully'
    });
  } catch (err) {
    console.error('❌ Error revoking proof:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to revoke proof',
      error: err.message
    });
  }
});

module.exports = router;
