import Team from "./Team";
import Competition from "./Competition";
import MatchGraphic from "./MatchGraphic";
import User from "./User";

// associations
MatchGraphic.belongsTo(Team, { foreignKey: "homeTeamId", as: "homeTeam" });
MatchGraphic.belongsTo(Team, { foreignKey: "awayTeamId", as: "awayTeam" });
MatchGraphic.belongsTo(Competition, {
  foreignKey: "competitionId",
  as: "competition",
});

User.hasMany(Team, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Competition, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(MatchGraphic, { foreignKey: "userId", onDelete: "CASCADE" });

Team.belongsTo(User, { foreignKey: "userId" });
Competition.belongsTo(User, { foreignKey: "userId" });
MatchGraphic.belongsTo(User, { foreignKey: "userId" });

export { User, Team, Competition, MatchGraphic };
