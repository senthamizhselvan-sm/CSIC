const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  type: {
    type: String,
    default: 'government_id'
  },

  issuer: {
    type: String,
    required: true
  },

  data: {
    fullName: String,
    dateOfBirth: String, // NEVER shared
    nationality: String,
    idNumber: String, // NEVER shared
    address: String // NEVER shared
  },

  verifiedAt: {
    type: Date,
    default: Date.now
  },

  validUntil: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
  },

  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Credential', CredentialSchema);
