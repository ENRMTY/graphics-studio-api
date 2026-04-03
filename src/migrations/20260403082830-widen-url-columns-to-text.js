"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const TEXT = { type: Sequelize.TEXT, allowNull: true };

    await queryInterface.changeColumn("Teams", "logoUrl", TEXT);
    await queryInterface.changeColumn("Competitions", "iconUrl", TEXT);

    const mgCols = [
      "bgImageUrl",
      "competitionIconUrl",
      "homeTeamLogoUrl",
      "awayTeamLogoUrl",
    ];
    for (const col of mgCols) {
      await queryInterface.changeColumn("MatchGraphics", col, TEXT);
    }
  },

  async down(queryInterface, Sequelize) {
    const STR = { type: Sequelize.STRING, allowNull: true };

    await queryInterface.changeColumn("Teams", "logoUrl", STR);
    await queryInterface.changeColumn("Competitions", "iconUrl", STR);

    const mgCols = [
      "bgImageUrl",
      "competitionIconUrl",
      "homeTeamLogoUrl",
      "awayTeamLogoUrl",
    ];
    for (const col of mgCols) {
      await queryInterface.changeColumn("MatchGraphics", col, STR);
    }
  },
};
