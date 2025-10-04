const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();

const { sequelize, testConnection } = require('./utils/database');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz.js');
const recommendationRoutes = require('./routes/recommendation');
const userRoutes = require('./routes/user');
const outfitRoutes = require('./routes/outfit');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', ts: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/outfits', outfitRoutes);

// 404 and error handlers
app.use('*', (req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal error' });
});

async function start() {
  try {
    await testConnection();
    // load models and associations
    require('./models');
    await sequelize.sync({ alter: false });
    app.listen(PORT, () => console.log(`Node API running on ${PORT}`));
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
}

start();

module.exports = app;
