'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Podcast_Genres', {
      podcast_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Podcasts',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      genre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Genres',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Podcast_Genres');
  }
};