import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

export interface PlayerAttributes {
  id: string;
  userId: string | null;
  name: string;
  number: number | null;
  position: string;
  lastUsed: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlayerCreationAttributes extends Optional<
  PlayerAttributes,
  "id" | "userId" | "number" | "position" | "lastUsed"
> {}

class Player
  extends Model<PlayerAttributes, PlayerCreationAttributes>
  implements PlayerAttributes
{
  declare id: string;
  declare userId: string | null;
  declare name: string;
  declare number: number | null;
  declare position: string;
  declare lastUsed: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Player.init(
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
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "",
    },
    lastUsed: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Players",
    modelName: "Player",
    indexes: [{ unique: true, fields: ["userId", "name"] }],
  },
);

export default Player;
