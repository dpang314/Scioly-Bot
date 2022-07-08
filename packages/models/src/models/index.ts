import 'pg';
import {Sequelize} from 'sequelize';
import TemplateEvent from './TemplateEventModel';
import Template from './TemplateModel';
import Test from './TestModel';
import TournamentEvent from './TournamentEventModel';
import Tournament from './TournamentModel';
import User from './User';

// Creating in a function makes it easier to create mock databases

const createDatabase = (DATABASE_CONNECTION: string) => {
  const sequelize = new Sequelize(DATABASE_CONNECTION, {
    logging: false,
  });

  const models = [
    TemplateEvent,
    Template,
    Test,
    TournamentEvent,
    Tournament,
    User,
  ];

  models.forEach((model) => model.initialize(sequelize));

  Template.hasMany(TemplateEvent, {
    sourceKey: 'id',
    foreignKey: 'templateId',
    as: 'templateEvents',
  });

  Test.belongsTo(TournamentEvent, {
    as: 'tournamentEvent',
  });

  TournamentEvent.hasMany(Test, {
    sourceKey: 'id',
    foreignKey: 'tournamentEventId',
    as: 'tests',
  });

  Tournament.hasMany(Test, {
    sourceKey: 'id',
    foreignKey: 'tournamentId',
    as: 'tests',
  });

  Tournament.hasMany(TournamentEvent, {
    sourceKey: 'id',
    foreignKey: 'tournamentId',
    as: 'tournamentEvents',
  });

  User.hasMany(Template, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'templates',
  });

  User.hasMany(Tournament, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'tournaments',
  });

  return sequelize;
};

export * from './TemplateModel';
export * from './TemplateEventModel';
export * from './TestModel';
export * from './TournamentEventModel';
export * from './TournamentModel';
export * from './User';

export {
  createDatabase,
  TemplateEvent,
  Template,
  Test,
  TournamentEvent,
  Tournament,
  User,
};
