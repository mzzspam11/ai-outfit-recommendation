const { User, Quiz, Outfit } = require('../models');
const { generateTokens } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, gender, dateOfBirth } = req.body;
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(409).json({ error: 'User already exists' });
      const user = await User.create({ email, password, firstName, lastName, gender, dateOfBirth });
      const tokens = generateTokens(user.id);
      res.status(201).json({ user: user.toJSON(), tokens });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await user.validatePassword(password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const tokens = generateTokens(user.id);
      res.json({ user: user.toJSON(), tokens });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid refresh token' });
      const tokens = generateTokens(user.id);
      res.json({ tokens });
    } catch {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  async logout(req, res) {
    res.json({ message: 'Logged out' });
  }

  async getProfile(req, res) {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Quiz, as: 'quizzes' }, { model: Outfit, as: 'outfits' }]
    });
    res.json({ user: user?.toJSON() });
  }
}

module.exports = new AuthController();
