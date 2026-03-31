import Team from "./Team";
import Competition from "./Competition";
import MatchGraphic from "./MatchGraphic";

// associations
MatchGraphic.belongsTo(Team, { foreignKey: "homeTeamId", as: "homeTeam" });
MatchGraphic.belongsTo(Team, { foreignKey: "awayTeamId", as: "awayTeam" });
MatchGraphic.belongsTo(Competition, {
  foreignKey: "competitionId",
  as: "competition",
});

export { Team, Competition, MatchGraphic };
