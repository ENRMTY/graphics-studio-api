"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_MatchGraphics_graphicType" ADD VALUE IF NOT EXISTS 'transfer';`,
    );

    await queryInterface.addColumn("MatchGraphics", "transferKind", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    await queryInterface.addColumn("MatchGraphics", "transferFee", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn("MatchGraphics", "transferStatus", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn("MatchGraphics", "transferKind");
    await queryInterface.removeColumn("MatchGraphics", "transferFee");
    await queryInterface.removeColumn("MatchGraphics", "transferStatus");
  },
};
