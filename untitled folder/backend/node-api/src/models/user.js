const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('Users', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.ENUM('male', 'female', 'other') },
  dateOfBirth: { type: DataTypes.DATE },
  profilePicture: { type: DataTypes.STRING },
  preferences: { type: DataTypes.JSONB, defaultValue: {} },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

User.addHook('beforeCreate', async (user) => {
  if (user.password) user.password = await bcrypt.hash(user.password, 12);
});
User.addHook('beforeUpdate', async (user) => {
  if (user.changed('password')) user.password = await bcrypt.hash(user.password, 12);
});

User.prototype.validatePassword = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

User.prototype.toJSON = function () {
  const v = { ...this.get() };
  delete v.password;
  return v;
};

module.exports = User;
