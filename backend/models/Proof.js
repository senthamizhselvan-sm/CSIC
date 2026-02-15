const mongoose = require('mongoose');

const ProofSchema = new mongoose.Schema({
  proofId: {
    type: String,
    unique: true,
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  verifierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  verificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Verification',
    required: true
  },

  businessName: {
    type: String
  },

  sharedData: {
    // Contains ONLY requested minimal data
    ageVerified: Boolean,
    age: Number,
    nationality: String,
    fullName: String,
    address: String,
    identityVerified: Boolean
  },

  // NEW: Blockchain anchor metadata
  blockchain: {
    txHash: String,
    blockNumber: Number,
    network: String,
    confirmed: Boolean,
    confirmationTime: String,
    gasUsed: Number,
    proofHash: String,
    anchoredAt: Date,
    status: String,
    explorerUrl: String,
    blockHash: String,
    from: String,
    to: String,
    gasPrice: String,
    transactionFee: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  expiresAt: {
    type: Date,
    required: true,
    // TTL index will automatically delete documents when expiresAt passes
    index: { expireAfterSeconds: 0 }
  },

  revoked: {
    type: Boolean,
    default: false
  },

  revokedAt: Date
});

// Compound index for efficient querying
ProofSchema.index({ userId: 1, revoked: 1 });
ProofSchema.index({ verificationId: 1 });
ProofSchema.index({ 'blockchain.txHash': 1 }); // For blockchain explorer queries

module.exports = mongoose.model('Proof', ProofSchema);
