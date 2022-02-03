import { Sequelize, DataTypes, Model, ModelDefined, Optional } from 'sequelize';
import { DATABASE_CONNECTION } from './configLoader';

const sequelize = new Sequelize(DATABASE_CONNECTION);

interface TournamentAttributes {
  id: string,
  user_id: string,
  name: string,
  active: boolean,
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
    primaryKey: true,
    type: DataTypes.UUID,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.TEXT,
    allowNull: false,
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
}, {
    timestamps: false,
    tableName: 'tournaments',
});

interface TemplateTestAttributes {
  id: string,
  name: string,
  minutes: number,
  link: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateTestCreationAttributes extends Optional<TemplateTestAttributes, 'id'> {}

interface TemplateTestInstance
  extends Model<TemplateTestAttributes, TemplateTestCreationAttributes>,
    TemplateTestAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }
  
const TemplateTest: ModelDefined<
TemplateTestAttributes,
TemplateTestCreationAttributes
> = sequelize.define('Test', {
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
    allowNull: true,
    type: DataTypes.STRING,
  }
}, {
  timestamps: false,
  tableName: 'tests',
});


interface TemplateAttributes {
  id: string,
  name: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateCreationAttributes extends Optional<TemplateAttributes, 'id'> {}

interface TemplateInstance
  extends Model<TestAttributes, TemplateCreationAttributes>,
    TestAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }

const Template: ModelDefined<
TemplateAttributes,
TemplateCreationAttributes
> = sequelize.define('Template', {
  id: {
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'templates',
});

Template.hasMany(TemplateTest, {
  sourceKey: "id",
  foreignKey: "template_id",
  as: "template_tests",
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
> = sequelize.define('TemplateTest', {
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
  timestamps: false,
  tableName: 'template_tests',
});

Tournament.hasMany(Test, {
  sourceKey: "id",
  foreignKey: "tounament_id",
  as: "tests",
});

export { sequelize, Test, Template, Tournament };
export type { TestCreationAttributes, TemplateCreationAttributes, TemplateAttributes, TournamentCreationAttributes, TournamentAttributes, TemplateTestAttributes };

export const initDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
}