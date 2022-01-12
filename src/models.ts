import { DataTypes, Model, ModelDefined, Optional } from 'sequelize';
import sequelize from './sequelize';

interface TournamentAttributes {
  id: string,
  user_id: string,
  started: boolean,
  ended: boolean,
  finished: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TournamentCreationAttributes extends Optional<TournamentAttributes, 'id'> {}

interface TournamentInstance
  extends Model<TournamentAttributes, TournamentCreationAttributes>,
  TournamentAttributes {
    createdAt?: Date;
    updatedAt?: Date;
  }

const Tournament: ModelDefined<
  TournamentAttributes,
  TournamentCreationAttributes
> = sequelize.define('Tournament', {
  id: {
    allowNull: false,
    autoIncrement: false,
    primaryKey: true,
    type: DataTypes.UUID,
    unique: true,
  },
  user_id: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  started: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  ended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
    timestamps: false,
    tableName: 'tournaments',
});

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

interface TestInstance
  extends Model<TestAttributes, TestCreationAttributes>,
    TestAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }

const Test: ModelDefined<
TestAttributes,
TestCreationAttributes
> = sequelize.define('Test', {
  id: {
    allowNull: false,
    autoIncrement: false,
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
  timestamps: false,
  tableName: 'tests',
});

Tournament.hasMany(Test, {
  sourceKey: "id",
  foreignKey: "tounament_id",
  as: "tests",
});

export { Test, TestInstance }