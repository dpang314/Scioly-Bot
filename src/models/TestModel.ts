import { Optional, DataTypes, Model } from "sequelize/dist";

interface TestAttributes {
  id: string,
  user_id: string,
  partner1_id?: string,
  partner2_id?: string,
  time_started: Date,
  test_name: string,
  finished: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TestCreationAttributes extends Optional<TestAttributes, 'id'> {}

class Test extends Model<TestAttributes, TestCreationAttributes> implements TestAttributes {
  declare id: string;
  declare user_id: string;
  declare partner1_id: string | null;
  declare partner2_id: string | null;
  declare time_started: Date;
  declare test_name: string;
  declare finished: boolean;
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
    user_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    partner1_id: DataTypes.TEXT,
    partner2_id: DataTypes.TEXT,
    test_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    time_started: {
      type: DataTypes.DATE,
      allowNull: false,
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