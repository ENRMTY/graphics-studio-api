"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Teams", {
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
        onUpdate: "CASCADE",
      },

      name: {
        type: Sequelize.STRING(70),
        allowNull: false,
      },

      logoUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      logoPublicId: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // indexes
    await queryInterface.addIndex("Teams", ["userId"]);
    await queryInterface.addIndex("Teams", ["name"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Teams");
  },
};
