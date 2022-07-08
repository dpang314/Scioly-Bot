import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import {
  TournamentAttributes,
  TournamentCreationAttributes,
} from 'scioly-bot-types';
import Test from './TestModel';
import TournamentEvent from './TournamentEventModel';

class Tournament
  extends Model<TournamentAttributes, TournamentCreationAttributes>
  implements TournamentAttributes
{
  declare id: string;

  declare name: string;

  declare active: boolean;

  declare submission: string;

  declare readonly userId?: string;

  declare readonly tournamentEvents?: TournamentEvent[];

  declare readonly tests?: Test[];

  declare static associations: {
    // eslint-disable-next-line no-use-before-define
    tournamentEvents: Association<Tournament, TournamentEvent>;
    // eslint-disable-next-line no-use-before-define
    tests: Association<Tournament, Test>;
  };

  declare createTournamentEvent: HasManyCreateAssociationMixin<TournamentEvent>;
  declare getTournamentEvents: HasManyGetAssociationsMixin<TournamentEvent>;

  declare addTest: HasManyAddAssociationMixin<Test, number>;

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
          type: DataTypes.TEXT,
          allowNull: false,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        submission: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'tournaments',
        timestamps: false,
      },
    );
  }
}

export default Tournament;
