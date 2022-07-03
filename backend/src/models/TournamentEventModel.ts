import {
  Association,
  DataTypes,
  HasManyCreateAssociationMixin,
  Model,
  Optional,
  Sequelize,
} from 'sequelize';
import Test from './TestModel';
import yup from 'yup';

interface TournamentEventAttributes {
  id: string;
  name: string;
  minutes: number;
  link: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TournamentEventCreationAttributes
  extends Optional<TournamentEventAttributes, 'id'> {}

const tournamentEventSchema: yup.SchemaOf<TournamentEventCreationAttributes> =
  yup.object({
    id: yup.string().optional(),
    name: yup.string().required(),
    minutes: yup.number().required(),
    link: yup.string().required(),
  });

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
      },
    );
  }
}

export default TournamentEvent;
export {tournamentEventSchema};
export type {TournamentEventAttributes, TournamentEventCreationAttributes};
