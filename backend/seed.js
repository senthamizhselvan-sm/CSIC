const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Credential = require('./models/Credential');
const Verification = require('./models/Verification');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected for seeding'))
  .catch(err => console.log(err));

async function seed() {
  await User.deleteMany({});
  await Credential.deleteMany({});
  await Verification.deleteMany({});

  const hashed = await bcrypt.hash('demo123', 10);

  // Demo User
  const user = await User.create({
    name: 'Rahul Sharma',
    email: 'demo@user.com',
    password: hashed,
    role: 'user'
  });

  // Verified Credential
  const credential = await Credential.create({
    userId: user._id,
    issuer: 'DigiLocker',
    data: {
      fullName: 'Rahul Sharma',
      dateOfBirth: '1998-04-12',
      nationality: 'Indian',
      idNumber: 'XXXX-XXXX-1234',
      address: 'Mumbai, Maharashtra'
    },
    verifiedAt: new Date('2025-01-15'),
    validUntil: new Date('2026-12-31'),
    isActive: true
  });

  // Demo Business
  const demoBusiness = await User.create({
    name: 'Grand Hotel Mumbai',
    email: 'demo@business.com',
    password: hashed,
    role: 'business'
  });

  const extraBusinesses = await User.insertMany([
    {
      name: 'Taj Hotel',
      email: 'taj@business.com',
      password: hashed,
      role: 'business'
    },
    {
      name: 'HDFC Bank',
      email: 'hdfc@business.com',
      password: hashed,
      role: 'business'
    },
    {
      name: 'Amazon',
      email: 'amazon@business.com',
      password: hashed,
      role: 'business'
    },
    {
      name: 'Zoomcar',
      email: 'zoomcar@business.com',
      password: hashed,
      role: 'business'
    },
    {
      name: 'Apollo Hospitals',
      email: 'apollo@business.com',
      password: hashed,
      role: 'business'
    }
  ]);

  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;

  const verifications = [
    {
      requestId: 'VF-AB12CD',
      businessId: demoBusiness._id,
      businessName: 'Grand Hotel Mumbai',
      userId: user._id,
      requestedData: [
        { field: 'age', type: 'verification_only' },
        { field: 'nationality', type: 'full' }
      ],
      status: 'approved',
      sharedData: {
        ageVerified: true,
        ageRange: '21+',
        nationality: credential.data.nationality
      },
      proofId: 'proof-demo-1',
      cryptographicProof: 'proofhash-demo-1',
      blockchainTxId: '#TX123456',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + fiveMinutes),
      approvedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 1000),
      proofExpiresAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + fiveMinutes)
    },
    {
      requestId: 'VF-EF34GH',
      businessId: extraBusinesses[0]._id,
      businessName: 'Taj Hotel',
      userId: user._id,
      requestedData: [{ field: 'name', type: 'verification_only' }],
      status: 'denied',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 24 * 60 * 60 * 1000 + fiveMinutes)
    },
    {
      requestId: 'VF-IJ56KL',
      businessId: extraBusinesses[1]._id,
      businessName: 'HDFC Bank',
      requestedData: [
        { field: 'age', type: 'verification_only' },
        { field: 'address', type: 'full' }
      ],
      status: 'expired',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + fiveMinutes)
    },
    {
      requestId: 'VF-MN78OP',
      businessId: extraBusinesses[2]._id,
      businessName: 'Amazon',
      userId: user._id,
      requestedData: [
        { field: 'name', type: 'full' },
        { field: 'nationality', type: 'full' }
      ],
      status: 'revoked',
      sharedData: {
        fullName: credential.data.fullName,
        nationality: credential.data.nationality
      },
      proofId: 'proof-demo-2',
      cryptographicProof: 'proofhash-demo-2',
      blockchainTxId: '#TX654321',
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 6 * 60 * 60 * 1000 + fiveMinutes),
      approvedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000 + 30 * 1000),
      proofExpiresAt: new Date(now.getTime() - 6 * 60 * 60 * 1000 + fiveMinutes),
      revokedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000)
    },
    {
      requestId: 'VF-QR90ST',
      businessId: extraBusinesses[3]._id,
      businessName: 'Zoomcar',
      userId: user._id,
      requestedData: [{ field: 'age', type: 'verification_only' }],
      status: 'approved',
      sharedData: {
        ageVerified: true,
        ageRange: '21+'
      },
      proofId: 'proof-demo-3',
      cryptographicProof: 'proofhash-demo-3',
      blockchainTxId: '#TX777777',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 2 * 60 * 60 * 1000 + fiveMinutes),
      approvedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000 + 45 * 1000),
      proofExpiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000)
    }
  ];

  await Verification.insertMany(verifications);

  console.log('✅ Database seeded successfully');
  console.log('Demo User: demo@user.com / demo123');
  console.log('Demo Business: demo@business.com / demo123');
  console.log(`Created ${verifications.length} sample verifications`);
  process.exit(0);
}

seed();
