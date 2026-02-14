const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true
  },

  businessName: {
    type: String,
    required: true
  },

  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  requestedData: [
    new mongoose.Schema(
      {
        field: String, // age, name, nationality
        type: String   // verification_only / full
      },
      { _id: false }
    )
  ],

  status: {
    type: String,
    enum: ['pending', 'approved', 'denied', 'expired', 'revoked'],
    default: 'pending'
  },

  sharedData: {
    ageVerified: Boolean,
    ageRange: String,
    nameVerified: Boolean,
    fullName: String,
    nationality: String
  },

  proofId: String,

  cryptographicProof: String, // simulated
  blockchainTxId: String,     // simulated
  nonce: String,              // for replay protection

  expiresAt: Date,

  approvedAt: Date,
  proofExpiresAt: Date,
  revokedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Verification', VerificationSchema);
