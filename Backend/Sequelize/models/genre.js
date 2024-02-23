'use strict';
const {
  Model
} = require('sequelize');
const Podcast = require('./podcast');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(Podcast, {
        foreignKey: 'genre_id'
      })
    }
  }
  Genre.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Genre',
    underscored: true
  });
  return Genre;
};