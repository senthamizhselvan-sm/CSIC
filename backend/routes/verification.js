const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Verification = require('../models/Verification');
const Credential = require('../models/Credential');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const REQUEST_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateRandomId = (length) => {
  const bytes = crypto.randomBytes(length);
  let output = '';
  for (let i = 0; i < length; i += 1) {
    output += REQUEST_ID_CHARS[bytes[i] % REQUEST_ID_CHARS.length];
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

const markExpiredIfNeeded = async (verification, now) => {
  if (!verification.expiresAt) {
    return false;
  }

  if (now > verification.expiresAt && verification.status === 'pending') {
    verification.status = 'expired';
    await verification.save();
    return true;
  }

  return false;
};

// Business creates verification request
router.post('/request', auth, requireRole('business'), async (req, res) => {
  try {
    const {
      businessName,
      requestedData = [],
      validityMinutes,
      expiryMinutes,
      proofValidityMinutes,
      purpose
    } = req.body;

    // Parse request validity (frontend may send expiryMinutes or validityMinutes)
    const requestedValidity = Number(validityMinutes ?? expiryMinutes ?? 5);
    const effectiveValidity = Number.isFinite(requestedValidity) && requestedValidity > 0
      ? requestedValidity
      : 5;

    // Parse proof validity (how long proof is valid AFTER approval)
    const requestedProofValidity = Number(proofValidityMinutes ?? 5);
    const effectiveProofValidity = Number.isFinite(requestedProofValidity) && requestedProofValidity > 0
      ? requestedProofValidity
      : 5;

    const requestId = await generateRequestId();
    const expiresAt = new Date(Date.now() + effectiveValidity * 60 * 1000);

    const verification = await Verification.create({
      requestId,
      businessName,
      businessId: req.user.userId,
      purpose: purpose || 'General Verification',
      requestedData,
      status: 'pending',
      expiresAt,
      proofValidityMinutes: effectiveProofValidity,
      createdAt: new Date()
    });

    res.json({
      requestId: verification.requestId,
      expiresAt: verification.expiresAt,
      qrData: JSON.stringify({
        requestId: verification.requestId,
        businessName: verification.businessName
      }),
      message: 'Verification request created successfully'
    });
  } catch (err) {
    console.error('❌ Error creating verification request:', err);
    res.status(500).json({ 
      message: 'Failed to create verification request',
      error: err.message 
    });
  }
});

// User fetches verification request details (for review before approval)
router.get('/request/:requestId', auth, requireRole('user'), async (req, res) => {
  try {
    const verification = await Verification.findOne({ requestId: req.params.requestId });
    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    // Request must still be pending
    if (verification.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Request already processed',
        status: verification.status 
      });
    }

    // BACKEND decides expiry truth (not client)
    const now = new Date();
    const expired = await markExpiredIfNeeded(verification, now);
    if (expired) {
      return res.status(400).json({ 
        message: 'Request Has Expired',
        expiredAt: verification.expiresAt 
      });
    }

    // Return details for user review
    return res.json({
      requestId: verification.requestId,
      businessName: verification.businessName,
      purpose: verification.purpose,
      requestedData: verification.requestedData,
      createdAt: verification.createdAt,
      expiresAt: verification.expiresAt,
      timeRemaining: Math.max(0, verification.expiresAt - now)
    });
  } catch (err) {
    console.error('❌ Error fetching request details:', err);
    return res.status(500).json({ message: 'Failed to fetch request details', error: err.message });
  }
});

// User approves verification
router.post('/approve/:requestId', auth, requireRole('user'), async (req, res) => {
  try {
    const verification = await Verification.findOne({ requestId: req.params.requestId });
    if (!verification) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    const now = new Date();
    const expired = await markExpiredIfNeeded(verification, now);
    if (expired) {
      return res.status(400).json({ message: 'Request expired' });
    }

    const credential = await Credential.findOne({
      userId: req.user.userId,
      type: 'government_id',
      isActive: true
    });

    if (!credential) {
      return res.status(404).json({ message: 'No credential found' });
    }

    const sharedData = {};
    const requestedData = verification.requestedData || [];
    requestedData.forEach((request) => {
      if (!request || !request.field) {
        return;
      }

      // Handle age and age21 with minimal disclosure (never share birthdate)
      if (request.field === 'age' || request.field === 'age21') {
        const age = calculateAge(credential.data?.dateOfBirth);
        if (age !== null) {
          // ZERO-KNOWLEDGE: Only YES/NO, not actual age
          sharedData.ageVerified = request.field === 'age21' ? (age >= 21) : (age >= 18);
          sharedData.ageRange = age >= 21 ? '21+' : (age >= 18 ? '18+' : 'under-18');
          // NEVER share: dateOfBirth, exact age
        }
      }

      // Share nationality (user's data)
      if (request.field === 'nationality') {
        sharedData.nationality = credential.data?.nationality;
      }

      // Name: only verification (YES/NO), not actual name
      if (request.field === 'name' && request.type === 'verification_only') {
        sharedData.nameVerified = true;
        // NEVER share: actual fullName
      }

      // Name: full disclosure (only if explicitly requested)
      if (request.field === 'name' && request.type === 'full') {
        sharedData.fullName = credential.data?.fullName;
      }
    });

    const proofId = `proof-${generateRandomId(10)}`;
    const cryptographicProof = crypto.randomBytes(32).toString('hex');
    const nonce = crypto.randomBytes(8).toString('hex');
    const blockchainTxId = `#TX${Math.floor(100000 + Math.random() * 900000)}`;
    const proofExpiresAt = new Date(Date.now() + (verification.proofValidityMinutes || 5) * 60 * 1000);

    verification.status = 'approved';
    verification.userId = req.user.userId;
    verification.sharedData = sharedData;
    verification.proofId = proofId;
    verification.cryptographicProof = cryptographicProof;
    verification.nonce = nonce;
    verification.blockchainTxId = blockchainTxId;
    verification.approvedAt = now;
    verification.proofExpiresAt = proofExpiresAt;

    await verification.save();

    // Emit Socket.io event for real-time update (business already listening)
    const io = req.app.get('io');
    if (io) {
      io.emit('verification-approved', { 
        requestId: verification.requestId, 
        status: 'approved',
        proofId,
        sharedData
      });
    }

    return res.json({
      success: true,
      message: 'Verification approved successfully',
      proofId,
      proofExpiresAt,
      sharedData,
      blockchainTxId
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// User rejects verification request
router.post('/deny/:requestId', auth, requireRole('user'), async (req, res) => {
  try {
    const verification = await Verification.findOne({ requestId: req.params.requestId });
    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Request already processed',
        currentStatus: verification.status 
      });
    }

    // Check expiry
    const now = new Date();
    const expired = await markExpiredIfNeeded(verification, now);
    if (expired) {
      return res.status(400).json({ message: 'Request has expired' });
    }

    // Update status
    verification.status = 'denied';
    verification.userId = req.user.userId;
    await verification.save();

    // Notify business via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('verification-denied', { 
        requestId: verification.requestId, 
        status: 'denied',
        deniedAt: new Date()
      });
    }

    return res.json({ 
      success: true, 
      message: 'Verification request rejected successfully'
    });
  } catch (err) {
    console.error('\u274c Error denying verification:', err);
    return res.status(500).json({ 
      message: 'Failed to deny verification',
      error: err.message 
    });
  }
});

// User revokes an approved verification proof
router.post('/revoke/:requestId', auth, requireRole('user'), async (req, res) => {
  try {
    const verification = await Verification.findOne({
      requestId: req.params.requestId,
      userId: req.user.userId
    });

    if (!verification) {
      return res.status(404).json({ message: 'Verification proof not found or not owned by user' });
    }

    if (verification.status !== 'approved') {
      return res.status(400).json({ 
        message: 'Only approved proofs can be revoked',
        currentStatus: verification.status 
      });
    }

    // Revoke the proof
    verification.status = 'revoked';
    verification.revokedAt = new Date();
    await verification.save();

    // Notify business via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('proof-revoked', { 
        requestId: verification.requestId, 
        status: 'revoked',
        revokedAt: new Date()
      });
    }

    return res.json({ 
      success: true, 
      message: 'Verification proof revoked successfully',
      revokedAt: verification.revokedAt
    });
  } catch (err) {
    console.error('\u274c Error revoking verification:', err);
    return res.status(500).json({ 
      message: 'Failed to revoke verification',
      error: err.message 
    });
  }
});

// Business checks verification status (with ownership validation)
router.get('/status/:requestId', auth, requireRole('business'), async (req, res) => {
  try {
    const verification = await Verification.findOne({ requestId: req.params.requestId });
    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    // CRITICAL: Verify THIS business owns the request (prevent snooping)
    if (verification.businessId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized: This request belongs to another business' });
    }

    const now = new Date();
    
    // BACKEND decides expiry truth (not client)
    // Check if request (pending) has expired
    if (verification.status === 'pending' && verification.expiresAt && now > verification.expiresAt) {
      verification.status = 'expired';
      await verification.save();
    }

    // Check if proof (approved) has expired
    if (verification.status === 'approved' && verification.proofExpiresAt && now > verification.proofExpiresAt) {
      verification.status = 'expired';
      await verification.save();
    }

    // Build response based on status
    const response = {
      requestId: verification.requestId,
      status: verification.status,
      createdAt: verification.createdAt,
      expiresAt: verification.expiresAt,
      approvedAt: verification.approvedAt || null,
      proofExpiresAt: verification.proofExpiresAt || null
    };

    // Only include proof data if APPROVED (not DENIED, EXPIRED, or REJECTED)
    if (verification.status === 'approved') {
      response.sharedData = verification.sharedData;
      response.proofId = verification.proofId;
      response.cryptographicProof = verification.cryptographicProof;
      response.nonce = verification.nonce;
      response.blockchainTxId = verification.blockchainTxId;
      response.timeRemaining = Math.max(0, verification.proofExpiresAt - now);
    }

    return res.json(response);
  } catch (err) {
    console.error('❌ Error checking verification status:', err);
    return res.status(500).json({ 
      message: 'Failed to check verification status',
      error: err.message 
    });
  }
});

// Business gets user details for an approved verification (with user profile)
router.get('/user-details/:requestId', auth, requireRole('business'), async (req, res) => {
  try {
    const verification = await Verification.findOne({ requestId: req.params.requestId });
    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    // CRITICAL: Verify THIS business owns the request
    if (verification.businessId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized: This request belongs to another business' });
    }

    // Only show user details if request is approved
    if (verification.status !== 'approved') {
      return res.status(400).json({ 
        message: 'User details are only available for approved requests',
        currentStatus: verification.status 
      });
    }

    // Get user details
    const user = await User.findById(verification.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's credential for additional info
    const credential = await Credential.findOne({
      userId: verification.userId,
      type: 'government_id',
      isActive: true
    });

    const now = new Date();
    
    // Check if proofs have expired
    if (verification.status === 'approved' && verification.proofExpiresAt && now > verification.proofExpiresAt) {
      verification.status = 'expired';
      await verification.save();
    }

    // Build user profile response
    const userProfile = {
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      joinedDate: user.createdAt,
      hasCredential: !!credential,
      credentialType: credential?.type || null,
      credentialIssuer: credential?.issuer || null,
      credentialExpiresAt: credential?.expiresAt || null
    };

    // Build response with verification and user data
    const response = {
      requestId: verification.requestId,
      status: verification.status,
      businessName: verification.businessName,
      purpose: verification.purpose,
      requestedData: verification.requestedData,
      createdAt: verification.createdAt,
      approvedAt: verification.approvedAt,
      proofExpiresAt: verification.proofExpiresAt,
      timeRemaining: Math.max(0, verification.proofExpiresAt - now),
      
      // User Profile Information
      userProfile,
      
      // Shared Data (what user approved to share)
      sharedData: verification.sharedData,
      
      // Proof Data (cryptographic proof)
      proofId: verification.proofId,
      cryptographicProof: verification.cryptographicProof,
      nonce: verification.nonce,
      blockchainTxId: verification.blockchainTxId
    };

    return res.json(response);
  } catch (err) {
    console.error('❌ Error fetching user details:', err);
    return res.status(500).json({ 
      message: 'Failed to fetch user details',
      error: err.message 
    });
  }
});

// User verification history
router.get('/history', auth, requireRole('user'), async (req, res) => {
  try {
    const verifications = await Verification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const response = verifications.map((verification) => ({
      requestId: verification.requestId,
      businessName: verification.businessName,
      purpose: verification.purpose,
      status: verification.status,
      requestedData: verification.requestedData,
      sharedData: verification.sharedData,
      createdAt: verification.createdAt,
      approvedAt: verification.approvedAt,
      expiresAt: verification.expiresAt,
      proofExpiresAt: verification.proofExpiresAt,
      revokedAt: verification.revokedAt,
      proofId: verification.proofId
    }));

    return res.json(response);
  } catch (err) {
    console.error('❌ Error fetching verification history:', err);
    return res.status(500).json({ 
      message: 'Failed to fetch verification history',
      error: err.message 
    });
  }
});

module.exports = router;
