const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Quiz = sequelize.define('Quizzes', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  userId: { type: DataTypes.UUID, allowNull: false },
  gender: { type: DataTypes.ENUM('male', 'female'), allowNull: false },
  answers: { type: DataTypes.JSONB, defaultValue: {} },
  aestheticProfile: { type: DataTypes.JSONB, defaultValue: {} },
  completedAt: { type: DataTypes.DATE },
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  score: { type: DataTypes.INTEGER }
}, { timestamps: true });

module.exports = Quiz;
