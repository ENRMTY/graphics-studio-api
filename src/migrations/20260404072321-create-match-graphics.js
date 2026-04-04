"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MatchGraphics", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      graphicType: {
        type: Sequelize.ENUM(
          "fulltime",
          "halftime",
          "matchday",
          "stats",
          "quote",
        ),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM("draft", "published"),
        allowNull: false,
        defaultValue: "draft",
      },

      // background
      bgImageUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bgImagePublicId: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      // competition (snapshot + FK)
      competitionId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Competitions",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      competitionName: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      competitionIconUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      competitionColor: {
        type: Sequelize.STRING(7),
        allowNull: true,
      },

      // teams
      homeTeamId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Teams",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      homeTeamName: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      homeTeamLogoUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      awayTeamId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Teams",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      awayTeamName: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      awayTeamLogoUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      // full-time
      homeScore: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      awayScore: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      events: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },

      // matchday
      matchDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      kickoffTime: {
        type: Sequelize.STRING(25),
        allowNull: true,
      },
      venue: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      // stats
      playerName: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      playerImageUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      playerImagePublicId: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      statsData: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      accentColor: {
        type: Sequelize.STRING(7),
        allowNull: true,
      },

      // quote
      playerRole: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      quoteText: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // indexes
    await queryInterface.addIndex("MatchGraphics", ["userId"]);
    await queryInterface.addIndex("MatchGraphics", [
      "graphicType",
      "status",
      "createdAt",
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MatchGraphics");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_MatchGraphics_graphicType";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_MatchGraphics_status";',
    );
  },
};
