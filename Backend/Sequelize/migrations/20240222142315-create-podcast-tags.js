'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Podcast_Tags', {
      podcast_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Podcasts',
          key: 'id'
        }
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Podcast_Tags');
  }
};