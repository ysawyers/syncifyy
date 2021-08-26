const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../dbConnection');

const Lobbies = sequelize.define(
  'lobbies',
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    private: {
      type: sequelize.literal('BOOLEAN'),
      defaultValue: false,
    },
    youtubeId: {
      type: DataTypes.STRING,
      defaultValue: 'MtN1YnoL46Q',
    },
    connections: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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

module.exports = Lobbies;
