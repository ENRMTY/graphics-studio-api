"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_MatchGraphics_graphicType" ADD VALUE IF NOT EXISTS 'goal';`,
    );
  },

  async down() {
    // Postgres cannot drop a single enum value in place.
  },
};
