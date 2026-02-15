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

// VERIFIER: Create verification request
router.post('/create', auth, requireRole('verifier'), async (req, res) => {
  try {
    const { requestedData } = req.body;

    if (!requestedData || requestedData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'requestedData is required'
      });
    }

    const requestId = await generateRequestId();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const verification = await Verification.create({
      requestId,
      businessName: req.user.businessName,
      verifierId: req.user.userId,
      requestedData,
      status: 'pending',
      expiresAt
    });

    return res.json({
      success: true,
      message: 'Verification request created',
      data: {
        requestId: verification.requestId,
        expiresAt: verification.expiresAt,
        expiresInMinutes: 5
      }
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
    const { credentialId } = req.body;
    const blockchainService = require('../services/blockchainService');

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

    // Check credentialId is provided
    if (!credentialId) {
      return res.status(400).json({
        success: false,
        message: 'Credential must be selected for approval'
      });
    }

    // Get the selected credential
    const credential = await Credential.findOne({
      _id: credentialId,
      userId: req.user.userId,
      isActive: true
    });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Selected credential not found or not active'
      });
    }

    // Check credential not expired
    if (credential.validUntil && now > credential.validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Your credential has expired'
      });
    }

    // Validate credential has all requested data fields
    const missingFields = [];
    for (const dataType of verification.requestedData) {
      if (dataType === 'age' && !credential.data?.dateOfBirth) {
        missingFields.push('date of birth (needed for age verification)');
      } else if (dataType === 'nationality' && !credential.data?.nationality) {
        missingFields.push('nationality');
      } else if (dataType === 'fullName' && !credential.data?.fullName) {
        missingFields.push('full name');
      } else if (dataType === 'address' && !credential.data?.address) {
        missingFields.push('address');
      } else if (dataType === 'identity' && !credential.data?.aadhaarNumber) {
        missingFields.push('identity information');
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `This credential is missing required fields: ${missingFields.join(', ')}`
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

    // Step 4: Anchor proof to blockchain (SIMULATED)
    const proofData = {
      proofId,
      userId: req.user.userId,
      verifierId: verification.verifierId,
      verificationId: verification._id,
      businessName: verification.businessName,
      sharedData,
      expiresAt: proofExpiresAt
    };

    const blockchainAnchor = await blockchainService.anchorProof(proofData);

    const proof = await Proof.create({
      proofId,
      userId: req.user.userId,
      verifierId: verification.verifierId,
      verificationId: verification._id,
      businessName: verification.businessName,
      sharedData,
      expiresAt: proofExpiresAt,
      // NEW: Blockchain anchor metadata
      blockchain: blockchainAnchor
    });

    // Update verification status
    verification.status = 'approved';
    verification.userId = req.user.userId;
    await verification.save();

    return res.json({
      success: true,
      message: 'Verification approved and anchored to blockchain',
      proof: {
        proofId: proof.proofId,
        sharedData: proof.sharedData,
        expiresAt: proof.expiresAt
      },
      blockchain: blockchainAnchor
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

    console.log('📥 Verification request received:', { businessName, requestedData, purpose });

    // Parse requestedData - handle both string array and object array formats
    let parsedRequestedData = requestedData;
    if (typeof requestedData === 'string') {
      try {
        parsedRequestedData = JSON.parse(requestedData);
      } catch (e) {
        console.error('Failed to parse requestedData string:', e);
      }
    }

    // Extract field names if requestedData contains objects
    const dataFields = Array.isArray(parsedRequestedData)
      ? parsedRequestedData.map(item => 
          typeof item === 'string' ? item : item.field
        )
      : [];

    console.log('✅ Parsed data fields:', dataFields);

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
      verifierId: req.user.userId, // Changed from businessId to verifierId
      purpose: purpose || 'General Verification',
      requestedData: dataFields, // Use parsed field names array
      status: 'pending',
      expiresAt,
      proofValidityMinutes: effectiveProofValidity,
      createdAt: new Date()
    });

    console.log('✅ Verification created:', verification.requestId);

    res.json({
      success: true,
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
      success: false,
      message: 'Failed to create verification request',
      error: err.message 
    });
  }
});

// User fetches verification request details (for review before approval)
router.get('/request/:requestId', auth, requireRole('user'), async (req, res) => {
  try {
    console.log('📥 Fetching verification request:', req.params.requestId);
    
    const verification = await Verification.findOne({ requestId: req.params.requestId });
    
    if (!verification) {
      console.log('❌ Verification request not found:', req.params.requestId);
      return res.status(404).json({ 
        success: false,
        message: 'Verification request not found. Please check the code and try again.' 
      });
    }

    console.log('✅ Found verification:', verification.requestId, 'Status:', verification.status);

    // Request must still be pending
    if (verification.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: 'Request already processed',
        status: verification.status 
      });
    }

    // BACKEND decides expiry truth (not client)
    const now = new Date();
    const expired = await markExpiredIfNeeded(verification, now);
    if (expired) {
      return res.status(400).json({ 
        success: false,
        message: 'Request Has Expired',
        expiredAt: verification.expiresAt 
      });
    }

    // Return details for user review
    return res.json({
      success: true,
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
    return res.status(500).json({ 
      success: false,
      message: 'Failed to fetch request details', 
      error: err.message 
    });
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
    console.log('📥 Status check request:', req.params.requestId, 'User:', req.user.userId, 'Role:', req.user.role);
    
    const verification = await Verification.findOne({ requestId: req.params.requestId });
    if (!verification) {
      console.log('❌ Verification not found:', req.params.requestId);
      return res.status(404).json({ message: 'Verification request not found' });
    }

    console.log('✅ Found verification:', verification.requestId, 'VerifierId:', verification.verifierId);

    // CRITICAL: Verify THIS business owns the request (prevent snooping)
    if (verification.verifierId.toString() !== req.user.userId) {
      console.log('❌ Ownership mismatch - Verification verifierId:', verification.verifierId, 'User ID:', req.user.userId);
      return res.status(403).json({ message: 'Unauthorized: This request belongs to another business' });
    }

    console.log('✅ Ownership verified');


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
    if (verification.verifierId.toString() !== req.user.userId) {
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
