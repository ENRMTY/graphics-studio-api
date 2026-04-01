"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_MatchGraphics_graphicType" ADD VALUE IF NOT EXISTS 'halftime';`,
    );
  },

  async down(queryInterface, Sequelize) {
    // removing a value from an enum type is not straightforward in PostgreSQL.
    console.warn(
      "Down migration for removing 'halftime' from enum is not implemented. Manual intervention may be required.",
    );
  },
};
