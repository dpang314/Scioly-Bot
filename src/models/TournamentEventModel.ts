import { Optional, Association, DataTypes, Model, HasManyCreateAssociationMixin } from "sequelize";
import { Test } from './TestModel';

interface TournamentEventAttributes {
  id: string,
  name: string,
  minutes: number,
  link: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TournamentEventCreationAttributes extends Optional<TournamentEventAttributes, 'id'> {}

class TournamentEvent extends Model<TournamentEventAttributes, TournamentEventCreationAttributes>
  implements TournamentEventAttributes {
    declare id: string;
    declare name: string;
    declare minutes: number;
    declare link: string;
    declare tournamentId: string;

    declare readonly tests?: Test[];

    declare static associations: {
      tests: Association<TournamentEvent, Test>;
    }
  
    declare createTest: HasManyCreateAssociationMixin<Test>;
  }

const TournamentEventModel = (sequelize) => {
  TournamentEvent.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      minutes: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      link: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: '',
      }
    }, 
    {
      sequelize,
      tableName: 'tournament_events',
    }
  )

  return TournamentEvent;
}


export { TournamentEventModel, TournamentEvent };
export type { TournamentEventAttributes, TournamentEventCreationAttributes };