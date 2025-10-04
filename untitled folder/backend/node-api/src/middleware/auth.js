const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    const hdr = req.headers['authorization'] || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Access token required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired' });
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const generateTokens = (userId) => {
  const payload = { id: userId };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
  return { accessToken, refreshToken };
};

module.exports = { authenticateToken, generateTokens };
