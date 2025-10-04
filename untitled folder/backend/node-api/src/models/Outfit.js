const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Outfit = sequelize.define('Outfits', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  userId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  items: { type: DataTypes.JSONB, defaultValue: [] },
  imageUrl: { type: DataTypes.STRING },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  occasion: { type: DataTypes.STRING },
  season: { type: DataTypes.STRING },
  isLiked: { type: DataTypes.BOOLEAN, defaultValue: false },
  isSaved: { type: DataTypes.BOOLEAN, defaultValue: false },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } }
}, { timestamps: true });

module.exports = Outfit;
