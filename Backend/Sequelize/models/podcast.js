'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Podcast extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {through: 'User_favourite_Podcasts', foreignKey: 'podcast_id', otherKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      this.belongsToMany(models.Genre, {through: 'Podcast_Genres', foreignKey: 'podcast_id', otherKey: 'genre_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      this.hasMany(models.Podcast_Rating, {
        foreignKey: 'podcast_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }
  Podcast.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    },
    youtube_link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    spotify_link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    third_link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/default_podcast_image.png'
    }
  }, {
    sequelize,
    modelName: 'Podcast',
    tableName: 'Podcasts',
    underscored: true
  });
  return Podcast;
};