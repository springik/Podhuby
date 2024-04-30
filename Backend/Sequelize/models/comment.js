'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Comment, {
        foreignKey: 'root_id',
        as: 'c2'
      })
      this.belongsTo(models.Comment, {
        foreignKey: 'root_id',
        as: 'parent'
      })
    }
  }
  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    root_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    podcast_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    underscored: true
  });
  return Comment;
};