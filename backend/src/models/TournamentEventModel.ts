import {
  Association,
  DataTypes,
  HasManyCreateAssociationMixin,
  Model,
  Sequelize,
} from 'sequelize';
import Test, {TestCreationAttributes, testCreationSchema} from './TestModel';
import * as Yup from 'yup';

interface TournamentEventAttributes {
  id: string;
  name: string;
  minutes: number;
  link: string;
  tests?: TestCreationAttributes[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TournamentEventCreationAttributes
  extends Omit<TournamentEventAttributes, 'id'> {}

const tournamentEventCreationSchema: Yup.SchemaOf<TournamentEventCreationAttributes> =
  Yup.object({
    name: Yup.string().max(100, 'Must be 100 characters or less').required(),
    minutes: Yup.number()
      .min(0, "Test can't have a negative time limit")
      .max(1440, 'Test must be under 1440 minutes long')
      .required(),
    link: Yup.string().required(),
    tests: Yup.array().of(testCreationSchema).optional(),
  });

interface TournamentEventUpdateAttributes
  extends Partial<Omit<TournamentEventAttributes, 'tests'>> {
  id: string;
}

const tournamentEventUpdateSchema: Yup.SchemaOf<TournamentEventUpdateAttributes> =
  Yup.object({
    id: Yup.string().required(),
    name: tournamentEventCreationSchema.fields.name.optional(),
    minutes: tournamentEventCreationSchema.fields.minutes.optional(),
    link: tournamentEventCreationSchema.fields.link.optional(),
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
        timestamps: false,
      },
    );
  }
}

export default TournamentEvent;
export {tournamentEventCreationSchema, tournamentEventUpdateSchema};
export type {TournamentEventAttributes, TournamentEventCreationAttributes, TournamentEventUpdateAttributes};
