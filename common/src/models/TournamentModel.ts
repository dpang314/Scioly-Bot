import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import Test from './TestModel';
import TournamentEvent, {
  TournamentEventCreationAttributes,
  tournamentEventCreationSchema,
} from './TournamentEventModel';
import * as Yup from 'yup';

interface TournamentAttributes {
  id: string;
  name: string;
  active: boolean;
  submission: string;
  tournamentEvents?: TournamentEventCreationAttributes[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TournamentCreationAttributes
  extends Omit<TournamentAttributes, 'id'> {}

const tournamentCreationSchema: Yup.SchemaOf<TournamentCreationAttributes> =
  Yup.object({
    name: Yup.string().max(100).required(),
    active: Yup.boolean().required(),
    submission: Yup.string().required(),
    tournamentEvents: Yup.array().of(tournamentEventCreationSchema).optional(),
  });

interface TournamentUpdateAttributes
  extends Partial<Omit<TournamentAttributes, 'tournamentEvents'>> {
  id: string;
}

const tournamentUpdateSchema: Yup.SchemaOf<TournamentUpdateAttributes> =
  Yup.object({
    id: Yup.string().required(),
    name: tournamentCreationSchema.fields.name.optional(),
    active: tournamentCreationSchema.fields.active.optional(),
    submission: tournamentCreationSchema.fields.submission.optional(),
  });

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
export {tournamentCreationSchema, tournamentUpdateSchema};
export type {
  TournamentAttributes,
  TournamentCreationAttributes,
  TournamentUpdateAttributes,
};
