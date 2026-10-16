"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_MatchGraphics_graphicType" ADD VALUE IF NOT EXISTS 'lineup';`,
    );
  },

  async down() {
    // postgres cannot drop a single enum value in place
  },
};
