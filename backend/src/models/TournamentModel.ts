import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  Model,
  Optional,
  Sequelize,
} from 'sequelize';
import Test from './TestModel';
import TournamentEvent, {
  TournamentEventCreationAttributes,
  tournamentEventSchema,
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
  extends Optional<TournamentAttributes, 'id'> {}

const tournamentSchema: Yup.SchemaOf<TournamentCreationAttributes> = Yup.object(
  {
    id: Yup.string().optional(),
    name: Yup.string().required(),
    active: Yup.boolean().required(),
    submission: Yup.string().required(),
    tournamentEvents: Yup.array().of(tournamentEventSchema).optional(),
  },
);

class Tournament
  extends Model<TournamentAttributes, TournamentCreationAttributes>
  implements TournamentAttributes
{
  declare id: string;

  declare userId: string;

  declare name: string;

  declare active: boolean;

  declare submission: string;

  declare readonly tournamentEvents?: TournamentEvent[];

  declare readonly tests?: Test[];

  declare static associations: {
    // eslint-disable-next-line no-use-before-define
    tournamentEvents: Association<Tournament, TournamentEvent>;
    // eslint-disable-next-line no-use-before-define
    tests: Association<Tournament, Test>;
  };

  declare createTournamentEvent: HasManyCreateAssociationMixin<TournamentEvent>;

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
export {tournamentSchema};
export type {TournamentAttributes, TournamentCreationAttributes};
