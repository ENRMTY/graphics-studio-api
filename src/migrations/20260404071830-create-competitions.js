"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Competitions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      iconUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      iconPublicId: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      color: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: "#C8102E",
      },

      isDefault: {
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
    await queryInterface.dropTable("Competitions");
  },
};
