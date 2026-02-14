const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev_only_insecure_secret';
    const decoded = jwt.verify(token, secret);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      businessName: decoded.businessName
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  console.log('🔐 Role check - Required:', role, 'User role:', req.user?.role, 'User ID:', req.user?.userId);
  if (!req.user || req.user.role !== role) {
    console.log('❌ Role check failed');
    return res.status(403).json({ message: 'Forbidden' });
  }
  console.log('✅ Role check passed');
  next();
};

module.exports = { auth, requireRole };
