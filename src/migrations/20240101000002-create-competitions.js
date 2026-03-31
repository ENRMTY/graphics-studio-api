'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Competitions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      iconUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      iconPublicId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING(7),   // hex e.g. #C8102E
        allowNull: false,
        defaultValue: '#C8102E',
      },
      isDefault: {
        // marks the pre-seeded competitions so we don't delete them accidentally
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 99,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Competitions');
  },
};
