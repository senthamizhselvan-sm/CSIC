const Verification = require('../models/Verification');

const cleanupExpiredVerifications = async () => {
  const now = new Date();

  const pendingExpired = await Verification.updateMany(
    {
      status: 'pending',
      expiresAt: { $lt: now }
    },
    { $set: { status: 'expired' } }
  );

  const approvedExpired = await Verification.updateMany(
    {
      status: 'approved',
      proofExpiresAt: { $lt: now }
    },
    { $set: { status: 'expired' } }
  );

  const total = (pendingExpired.modifiedCount || 0) + (approvedExpired.modifiedCount || 0);
  if (total > 0) {
    console.log(`Marked ${total} verifications as expired`);
  }
};

module.exports = { cleanupExpiredVerifications };
