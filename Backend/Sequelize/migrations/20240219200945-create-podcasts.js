'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Podcasts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT('medium'),
        allowNull: false
      },
      youtube_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      spotify_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      third_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image_path: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '/default_podcast_image.png'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Podcasts');
  }
};