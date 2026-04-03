"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const FK_OPTS = {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    };

    await queryInterface.addColumn("Teams", "userId", FK_OPTS);
    await queryInterface.addColumn("Competitions", "userId", FK_OPTS);
    await queryInterface.addColumn("MatchGraphics", "userId", FK_OPTS);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Teams", "userId");
    await queryInterface.removeColumn("Competitions", "userId");
    await queryInterface.removeColumn("MatchGraphics", "userId");
  },
};
