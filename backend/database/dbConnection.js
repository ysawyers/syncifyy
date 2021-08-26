const Sequelize = require('sequelize');
const config = require('../config');

const database = config.environment === 'production' ? process.env.DB_NAME : process.env.DB_NAME_LOCAL;
const user = config.environment === 'production' ? process.env.DB_USER : process.env.DB_USER_LOCAL;
const password = config.environment === 'production' ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_LOCAL;
const host = config.environment === 'production' ? process.env.DB_HOST : process.env.DB_HOST_LOCAL;

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;
