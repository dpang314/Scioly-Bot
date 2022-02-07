import { Optional, HasManyCreateAssociationMixin, DataTypes, Model, Association } from "sequelize";
import { TournamentEvent } from './TournamentEventModel';

interface TournamentAttributes {
  id: string,
  user_id: string,
  name: string,
  active: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TournamentCreationAttributes extends Optional<TournamentAttributes, 'id'> {}

class Tournament extends Model<TournamentAttributes, TournamentCreationAttributes> implements TournamentAttributes {
  declare id: string;
  declare user_id: string;
  declare name: string;
  declare active: boolean;

  declare readonly tournamentEvents?: TournamentEvent[];

  declare static associations: {
    templateEvents: Association<Tournament, TournamentEvent>;
  }

  declare createTournamentEvent: HasManyCreateAssociationMixin<TournamentEvent>;
}

const TournamentModel = (sequelize) => {
  Tournament.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, 
  {
      sequelize,
      tableName: 'tournaments',
  });
  
  return Tournament;
}

export { TournamentModel, Tournament };
export type { TournamentAttributes, TournamentCreationAttributes };