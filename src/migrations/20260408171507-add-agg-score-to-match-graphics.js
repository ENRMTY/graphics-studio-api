"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("MatchGraphics", "aggScoreHome", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn("MatchGraphics", "aggScoreAway", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("MatchGraphics", "aggScoreHome");
    await queryInterface.removeColumn("MatchGraphics", "aggScoreAway");
  },
};
