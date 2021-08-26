const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../dbConnection');

const Users = sequelize.define(
  'users',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lobby: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    created: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Users;
