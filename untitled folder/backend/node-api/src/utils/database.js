const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'fashion_recommendation',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? false : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: { freezeTableName: true }
  }
);

async function testConnection() {
  await sequelize.authenticate();
  console.log('DB connection ok');
}

module.exports = { sequelize, testConnection };
