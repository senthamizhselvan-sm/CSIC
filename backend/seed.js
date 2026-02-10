const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Credential = require('./models/Credential');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected for seeding'))
  .catch(err => console.log(err));

async function seed() {
  await User.deleteMany({});
  await Credential.deleteMany({});

  const hashed = await bcrypt.hash('demo123', 10);

  // Demo User
  const user = await User.create({
    name: 'Rahul Sharma',
    email: 'demo@user.com',
    password: hashed,
    role: 'user'
  });

  // Verified Credential
  await Credential.create({
    userId: user._id,
    issuer: 'DigiLocker',
    data: {
      fullName: 'Rahul Sharma',
      dateOfBirth: '1998-04-12',
      nationality: 'Indian',
      idNumber: 'XXXX-XXXX-1234'
    }
  });

  // Demo Business
  await User.create({
    name: 'Grand Hotel Mumbai',
    email: 'demo@business.com',
    password: hashed,
    role: 'business'
  });

  console.log('Demo data seeded');
  process.exit();
}

seed();
