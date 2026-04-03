import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

export interface CompetitionAttributes {
  id: string;
  name: string;
  iconUrl: string | null;
  iconPublicId: string | null;
  color: string;
  isDefault: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompetitionCreationAttributes extends Optional<
  CompetitionAttributes,
  "id" | "iconUrl" | "iconPublicId" | "isDefault" | "sortOrder"
> {}

class Competition
  extends Model<CompetitionAttributes, CompetitionCreationAttributes>
  implements CompetitionAttributes
{
  declare id: string;
  declare name: string;
  declare iconUrl: string | null;
  declare iconPublicId: string | null;
  declare color: string;
  declare isDefault: boolean;
  declare sortOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Competition.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iconUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iconPublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "#C8102E",
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 99,
    },
  },
  {
    sequelize,
    tableName: "Competitions",
    modelName: "Competition",
  },
);

export default Competition;
