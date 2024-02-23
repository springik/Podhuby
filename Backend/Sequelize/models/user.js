'use strict';
const {
  Model
} = require('sequelize');
const Podcast = require('../models/podcast.js')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(Podcast, {through: 'User_favourite_Podcasts'})
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pfpPath: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/default_pfp.jpg'
    }
  }, {
    sequelize,
    modelName: 'User',
    underscored: true
  });
  return User;
};