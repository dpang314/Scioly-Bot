import {
  DataTypes, NOW, Optional, Model, Sequelize,
} from 'sequelize';
// eslint-disable-next-line import/no-cycle
import TournamentEvent from './TournamentEventModel';

interface TestAttributes {
  id: string,
  userId: string,
  partner1Id?: string,
  partner2Id?: string,
  timeStarted?: Date,
  finished: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TestCreationAttributes extends Optional<TestAttributes, 'id'> {}

class Test extends Model<TestAttributes, TestCreationAttributes> implements TestAttributes {
  declare id: string;

  declare userId: string;

  declare partner1Id: string | null;

  declare partner2Id: string | null;

  declare timeStarted: Date;

  declare finished: boolean;

  declare tournamentId: string;

  // eslint-disable-next-line no-use-before-define
  declare readonly tournamentEvent: TournamentEvent;

  declare tournamentEventId: string;

  public static initialize(sequelize: Sequelize) {
    this.init({
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
    }, {
      sequelize,
      tableName: 'tests',
    });
  }
}

export default Test;
export type { TestAttributes, TestCreationAttributes };
