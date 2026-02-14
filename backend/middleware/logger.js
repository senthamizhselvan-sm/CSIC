const jwt = require('jsonwebtoken');

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'idNumber',
  'dateOfBirth',
  'photo'
]);

const redactSensitive = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitive(item));
  }

  if (value && typeof value === 'object') {
    const result = {};
    Object.keys(value).forEach((key) => {
      if (SENSITIVE_KEYS.has(key)) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = redactSensitive(value[key]);
      }
    });
    return result;
  }

  return value;
};

const logger = (req, res, next) => {
  const start = process.hrtime.bigint();

  if (!req.user && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      try {
        const secret = process.env.JWT_SECRET || 'dev_only_insecure_secret';
        const decoded = jwt.verify(token, secret);
        req.user = { userId: decoded.userId, role: decoded.role };
      } catch (err) {
        // Ignore token errors for logging purposes
      }
    }
  }

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
    const userId = req.user?.userId || 'anonymous';
    const body = Object.keys(req.body || {}).length
      ? JSON.stringify(redactSensitive(req.body))
      : '';

    const logLine = `[${timestamp}] ${req.method} ${req.originalUrl} | User: ${userId} | ${res.statusCode} | ${durationMs.toFixed(0)}ms`;
    if (body) {
      console.log(`${logLine} | Body: ${body}`);
    } else {
      console.log(logLine);
    }
  });

  next();
};

module.exports = logger;
