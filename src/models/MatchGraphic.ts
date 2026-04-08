import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

export type GraphicType =
  | "fulltime"
  | "halftime"
  | "matchday"
  | "stats"
  | "quote"
  | "transfer";
export type GraphicStatus = "draft" | "published";

export interface MatchEvent {
  id: string;
  type: "goal" | "penalty" | "red" | "og";
  player: string;
  minute: string;
  side: "home" | "away";
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  enabled: boolean;
}

export interface MatchGraphicAttributes {
  id: string;
  userId: string | null;
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
  aggScoreHome: number | null;
  aggScoreAway: number | null;
  events: MatchEvent[];

  // match day fields
  matchDate: string | null;
  kickoffTime: string | null;
  venue: string | null;

  // stats fields
  playerName: string | null;
  playerImageUrl: string | null;
  playerImagePublicId: string | null;
  statsData: StatItem[] | null;
  accentColor: string | null;

  // quote fields
  playerRole: string | null;
  quoteText: string | null;

  // transfer fields
  transferKind: string | null;
  transferFee: string | null;
  transferStatus: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface MatchGraphicCreationAttributes extends Optional<
  MatchGraphicAttributes,
  | "id"
  | "userId"
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
  | "aggScoreHome"
  | "aggScoreAway"
  | "events"
  | "matchDate"
  | "kickoffTime"
  | "venue"
  | "playerName"
  | "playerImageUrl"
  | "playerImagePublicId"
  | "statsData"
  | "accentColor"
  | "playerRole"
  | "quoteText"
  | "transferKind"
  | "transferFee"
  | "transferStatus"
> {}

class MatchGraphic
  extends Model<MatchGraphicAttributes, MatchGraphicCreationAttributes>
  implements MatchGraphicAttributes
{
  declare id: string;
  declare userId: string | null;
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
  declare aggScoreHome: number | null;
  declare aggScoreAway: number | null;
  declare events: MatchEvent[];

  declare matchDate: string | null;
  declare kickoffTime: string | null;
  declare venue: string | null;

  declare playerName: string | null;
  declare playerImageUrl: string | null;
  declare playerImagePublicId: string | null;
  declare statsData: StatItem[] | null;
  declare accentColor: string | null;

  declare playerRole: string | null;
  declare quoteText: string | null;

  declare transferKind: string | null;
  declare transferFee: string | null;
  declare transferStatus: string | null;

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
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    graphicType: {
      type: DataTypes.ENUM(
        "fulltime",
        "halftime",
        "matchday",
        "stats",
        "quote",
        "transfer",
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    },
    bgImageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bgImagePublicId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    competitionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    competitionName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    competitionIconUrl: {
      type: DataTypes.TEXT,
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
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    homeTeamLogoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    awayTeamId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    awayTeamName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    awayTeamLogoUrl: {
      type: DataTypes.TEXT,
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
    aggScoreHome: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    aggScoreAway: {
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
    playerName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    playerImageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    playerImagePublicId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    statsData: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    accentColor: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    playerRole: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    quoteText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    transferKind: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    transferFee: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    transferStatus: {
      type: DataTypes.STRING(20),
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
