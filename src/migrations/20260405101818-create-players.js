"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Players", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      position: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "",
      },

      lastUsed: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex("Players", ["userId"]);

    await queryInterface.addConstraint("Players", {
      fields: ["userId", "name"],
      type: "unique",
      name: "unique_player_per_user",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Players");
  },
};
