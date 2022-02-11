import {
  DataTypes, NOW,
} from 'sequelize';
import { Test } from './models';

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

  return Test;
};

export default TestModel;
