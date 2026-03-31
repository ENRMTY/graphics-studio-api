import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

export interface TeamAttributes {
  id: string;
  name: string;
  logoUrl: string | null;
  logoPublicId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TeamCreationAttributes
  extends Optional<TeamAttributes, 'id' | 'logoUrl' | 'logoPublicId'> {}

class Team extends Model<TeamAttributes, TeamCreationAttributes>
  implements TeamAttributes {
  declare id: string;
  declare name: string;
  declare logoUrl: string | null;
  declare logoPublicId: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Team.init(
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
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logoPublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Teams',
    modelName: 'Team',
  },
);

export default Team;
