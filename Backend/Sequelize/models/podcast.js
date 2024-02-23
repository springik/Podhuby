'use strict';
const {
  Model
} = require('sequelize');
const Genre = require('../models/genre.js')
const Tag = require('../models/tag.js')
const User = require('../models/user.js')
module.exports = (sequelize, DataTypes) => {
  class Podcast extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(Genre, {
        foreignKey: 'genre_id'
      });
      this.belongsToMany(Tag, {through: 'Podcast_Tags'})
      this.belongsToMany(User, {through: 'User_favourite_Podcasts'})
    }
  }
  Podcast.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    links: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/default_podcast_image.png'
    },
    genre_id: {
      type: DataTypes.INT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Podcast',
    underscored: true
  });
  return Podcast;
};