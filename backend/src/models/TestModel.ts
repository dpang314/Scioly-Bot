import {DataTypes, NOW, Optional, Model, Sequelize} from 'sequelize';
import TournamentEvent from './TournamentEventModel';
import * as Yup from 'yup';

interface TestAttributes {
  id: string;
  userId: string;
  partner1Id?: string;
  partner2Id?: string;
  timeStarted?: Date;
  finished: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TestCreationAttributes extends Optional<TestAttributes, 'id'> {}

const testSchema: Yup.SchemaOf<TestCreationAttributes> = Yup.object({
  id: Yup.string().optional(),
  userId: Yup.string().required(),
  partner1Id: Yup.string().optional(),
  partner2Id: Yup.string().optional(),
  timeStarted: Yup.date().optional(),
  finished: Yup.boolean().required(),
});

class Test
  extends Model<TestAttributes, TestCreationAttributes>
  implements TestAttributes
{
  declare id: string;

  declare userId: string;

  declare partner1Id: string;

  declare partner2Id: string;

  declare timeStarted: Date;

  declare finished: boolean;

  declare tournamentId: string;

  // eslint-disable-next-line no-use-before-define
  declare readonly tournamentEvent: TournamentEvent;

  declare tournamentEventId: string;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true,
        },
        userId: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        partner1Id: DataTypes.TEXT,
        partner2Id: DataTypes.TEXT,
        timeStarted: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: NOW,
        },
        finished: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'tests',
        timestamps: false,
      },
    );
  }
}

export default Test;
export {testSchema};
export type {TestAttributes, TestCreationAttributes};
