import { NOW, Optional, DataTypes, Model, Sequelize } from "sequelize";
import { TournamentEvent } from ".";

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

  declare readonly tournamentEvent: TournamentEvent;

  declare tournamentEventId: string;
}

const TestModel = (sequelize) => {
  Test.init({
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
      defaultValue: new Date(),
    },
    finished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  }, {
    sequelize,
    tableName: 'tests',
  });

  return Test;
}
  
export { TestModel, Test };
export type { TestAttributes, TestCreationAttributes };