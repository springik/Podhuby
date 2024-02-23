'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Podcast_Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Podcast_Tags.init({
    podcast_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Podcast_Tags',
    underscored: true,
  });
  return Podcast_Tags;
};