"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("MatchGraphics", "matchContext", {
      type: Sequelize.STRING(200),
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn("MatchGraphics", "graphicLayout", {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("MatchGraphics", "matchContext");
    await queryInterface.removeColumn("MatchGraphics", "graphicLayout");
  },
};
