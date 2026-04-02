import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

export type GraphicType = "fulltime" | "halftime" | "matchday";
export type GraphicStatus = "draft" | "published";

export interface MatchEvent {
  id: string;
  type: "goal" | "penalty" | "red" | "og";
  player: string;
  minute: string;
  side: "home" | "away";
}

export interface MatchGraphicAttributes {
  id: string;
  graphicType: GraphicType;
  status: GraphicStatus;

  bgImageUrl: string | null;
  bgImagePublicId: string | null;

  competitionId: string | null;
  competitionName: string | null;
  competitionIconUrl: string | null;
  competitionColor: string | null;

  homeTeamId: string | null;
  homeTeamName: string | null;
  homeTeamLogoUrl: string | null;

  awayTeamId: string | null;
  awayTeamName: string | null;
  awayTeamLogoUrl: string | null;

  // full-time fields
  homeScore: number | null;
  awayScore: number | null;
  events: MatchEvent[];

  // match day fields
  matchDate: string | null;
  kickoffTime: string | null;
  venue: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface MatchGraphicCreationAttributes extends Optional<
  MatchGraphicAttributes,
  | "id"
  | "status"
  | "bgImageUrl"
  | "bgImagePublicId"
  | "competitionId"
  | "competitionName"
  | "competitionIconUrl"
  | "competitionColor"
  | "homeTeamId"
  | "homeTeamName"
  | "homeTeamLogoUrl"
  | "awayTeamId"
  | "awayTeamName"
  | "awayTeamLogoUrl"
  | "homeScore"
  | "awayScore"
  | "events"
  | "matchDate"
  | "kickoffTime"
  | "venue"
> {}

class MatchGraphic
  extends Model<MatchGraphicAttributes, MatchGraphicCreationAttributes>
  implements MatchGraphicAttributes
{
  declare id: string;
  declare graphicType: GraphicType;
  declare status: GraphicStatus;

  declare bgImageUrl: string | null;
  declare bgImagePublicId: string | null;

  declare competitionId: string | null;
  declare competitionName: string | null;
  declare competitionIconUrl: string | null;
  declare competitionColor: string | null;

  declare homeTeamId: string | null;
  declare homeTeamName: string | null;
  declare homeTeamLogoUrl: string | null;

  declare awayTeamId: string | null;
  declare awayTeamName: string | null;
  declare awayTeamLogoUrl: string | null;

  declare homeScore: number | null;
  declare awayScore: number | null;
  declare events: MatchEvent[];

  declare matchDate: string | null;
  declare kickoffTime: string | null;
  declare venue: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

MatchGraphic.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    graphicType: {
      type: DataTypes.ENUM("fulltime", "halftime", "matchday"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    },
    bgImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bgImagePublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    competitionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    competitionName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    competitionIconUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    competitionColor: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    homeTeamId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    homeTeamName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    homeTeamLogoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    awayTeamId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    awayTeamName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    awayTeamLogoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    homeScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    awayScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    events: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    matchDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    kickoffTime: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    venue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "MatchGraphics",
    modelName: "MatchGraphic",
  },
);

export default MatchGraphic;
