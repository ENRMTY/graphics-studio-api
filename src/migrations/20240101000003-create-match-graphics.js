'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MatchGraphics', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      graphicType: {
        // 'fulltime' | 'matchday'
        type: Sequelize.ENUM('fulltime', 'matchday'),
        allowNull: false,
      },
      status: {
        // 'draft' | 'published'
        type: Sequelize.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft',
      },

      // Background image
      bgImageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bgImagePublicId: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // Competition (denormalised — we store what was selected at time of creation)
      competitionId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Competitions', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      competitionName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      competitionIconUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      competitionColor: {
        type: Sequelize.STRING(7),
        allowNull: true,
      },

      // Teams (FK + snapshot of name/logo at time of creation)
      homeTeamId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Teams', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      homeTeamName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      homeTeamLogoUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      awayTeamId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Teams', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      awayTeamName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      awayTeamLogoUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // Full-time specific
      homeScore: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      awayScore: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      events: {
        // JSON array of { id, type, player, minute, side }
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },

      // Match day specific
      matchDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      kickoffTime: {
        type: Sequelize.STRING(5),   // e.g. "17:30"
        allowNull: true,
      },
      venue: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Index for listing graphics by type + status efficiently
    await queryInterface.addIndex('MatchGraphics', ['graphicType', 'status', 'createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('MatchGraphics');
  },
};
