'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Podcast_Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Podcast, {
        foreignKey: 'podcast_id',
        as: 'podcast',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }
  Podcast_Rating.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    podcast_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Score must be an integer'
        },
        min: {
          args: [0],
          msg: 'Score must be larger than 0'
        },
        max: {
          args: [5],
          msg: 'Score must not be larger than 5'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Podcast_Rating',
    tableName: 'Podcast_Ratings',
    underscored: true,
  });
  return Podcast_Rating;
};