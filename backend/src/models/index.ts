import 'pg';
import {Sequelize} from 'sequelize';
import {DATABASE_CONNECTION} from '../configLoader';
import TemplateEvent from './TemplateEventModel';
import Template from './TemplateModel';
import Test from './TestModel';
import TournamentEvent from './TournamentEventModel';
import Tournament from './TournamentModel';
import User from './User';

const sequelize = new Sequelize(DATABASE_CONNECTION);

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

export {
  sequelize as db,
  TemplateEvent,
  Template,
  Test,
  TournamentEvent,
  Tournament,
  User,
};
