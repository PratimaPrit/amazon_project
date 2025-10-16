const { Sequelize } = require('sequelize');
const config = require('../config/sequelize.config.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  pool: dbConfig.pool,
  dialectOptions: process.env.DATABASE_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}
});

const db = {
  sequelize,
  Sequelize
};

module.exports = db;
