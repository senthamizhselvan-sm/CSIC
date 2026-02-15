const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true
  },

  verifierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  businessName: {
    type: String,
    required: true
  },

  requestedData: {
    type: [String],
    required: true
    // Valid values: 'age', 'nationality', 'fullName', 'address', 'identity'
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'expired', 'revoked'],
    default: 'pending'
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  }
});

// Compound index for efficient querying
VerificationSchema.index({ verifierId: 1, status: 1 });
// requestId index is already created by unique: true, no need for duplicate

module.exports = mongoose.model('Verification', VerificationSchema);
