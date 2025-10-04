const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const StyleHistory = sequelize.define('StyleHistories', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  userId: { type: DataTypes.UUID, allowNull: false },
  outfitId: { type: DataTypes.UUID, allowNull: false },
  action: { type: DataTypes.ENUM('viewed', 'liked', 'disliked', 'saved', 'worn', 'rated'), allowNull: false },
  metadata: { type: DataTypes.JSONB, defaultValue: {} }
}, { timestamps: true });

module.exports = StyleHistory;
