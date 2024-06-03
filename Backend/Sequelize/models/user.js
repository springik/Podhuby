'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Podcast, { through: 'User_favourite_Podcasts', foreignKey: 'user_id', otherKey: 'podcast_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
      this.hasMany(models.Comment, { foreignKey: 'author_id',onDelete: 'CASCADE', onUpdate: 'CASCADE' })
      this.hasMany(models.Comment_Report, { foreignKey: 'reporter_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    pfp_path: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/Images/pfps/default_pfp.jpg'
    },
    permision_level: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    },
    banned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  });
  return User;
};