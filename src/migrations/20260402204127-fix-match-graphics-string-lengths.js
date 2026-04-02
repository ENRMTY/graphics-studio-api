"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("MatchGraphics", "venue", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("MatchGraphics", "homeTeamName", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.changeColumn("MatchGraphics", "awayTeamName", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.changeColumn("MatchGraphics", "competitionName", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("MatchGraphics", "venue", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("MatchGraphics", "homeTeamName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("MatchGraphics", "awayTeamName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("MatchGraphics", "competitionName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
