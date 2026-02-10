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
    {
      field: String, // age, name, nationality
      type: String   // verification_only / full
    }
  ],

  status: {
    type: String,
    enum: ['pending', 'approved', 'denied', 'expired'],
    default: 'pending'
  },

  sharedData: {
    ageVerified: Boolean,
    ageRange: String,
    nameVerified: Boolean,
    nationality: String
  },

  cryptographicProof: String, // simulated
  blockchainTxId: String,     // simulated

  expiresAt: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Verification', VerificationSchema);
