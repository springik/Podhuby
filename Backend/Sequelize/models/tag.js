'use strict';
const {
  Model
} = require('sequelize');
const Podcast = require('../models/podcast.js')
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(Podcast, {through: 'Podcast_Tags'})
    }
  }
  Tag.init({
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
    modelName: 'Tag',
    underscored: true,
  });
  return Tag;
};