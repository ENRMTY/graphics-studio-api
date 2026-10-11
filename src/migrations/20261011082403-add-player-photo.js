"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Players", "photoUrl", {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn("Players", "photoPublicId", {
      type: Sequelize.STRING(300),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Players", "photoPublicId");
    await queryInterface.removeColumn("Players", "photoUrl");
  },
};
