import {
  Association,
  DataTypes,
  HasManyCreateAssociationMixin,
  Model,
  Sequelize,
} from 'sequelize';
import {
  TournamentEventAttributes,
  TournamentEventCreationAttributes,
} from 'scioly-bot-types';
import Test from './TestModel';

class TournamentEvent
  extends Model<TournamentEventAttributes, TournamentEventCreationAttributes>
  implements TournamentEventAttributes
{
  declare id: string;

  declare name: string;

  declare minutes: number;

  declare link: string;

  declare tournamentId: string;

  declare readonly tests?: Test[];

  declare static associations: {
    // eslint-disable-next-line no-use-before-define
    tests: Association<TournamentEvent, Test>;
  };

  declare createTest: HasManyCreateAssociationMixin<Test>;

  public static initialize(sequelize: Sequelize) {
    this.init(
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
        },
      },
      {
        sequelize,
        tableName: 'tournament_events',
        timestamps: false,
      },
    );
  }
}

export default TournamentEvent;
