import {TestAttributes, TestCreationAttributes} from 'scioly-bot-types';
import {DataTypes, NOW, Model, Sequelize} from 'sequelize';
import TournamentEvent from './TournamentEventModel';

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
