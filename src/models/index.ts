/* eslint-disable @typescript-eslint/no-var-requires */
import 'pg';
import { Sequelize } from 'sequelize';
import { DATABASE_CONNECTION } from '../configLoader';
import { TemplateEvent } from './TemplateEventModel';
import { Template } from './TemplateModel';
import { Test } from './TestModel';
import { TournamentEvent } from './TournamentEventModel';
import { Tournament } from './TournamentModel';

const TemplateModel = require('./TemplateModel');
const TemplateEventModel = require('./TemplateEventModel');
const TournamentModel = require('./TournamentModel');
const TestModel = require('./TestModel');
const TournamentEventModel = require('./TournamentEventModel');

const sequelize: Sequelize = new Sequelize(DATABASE_CONNECTION);

const db: {
  sequelize?: Sequelize,
  Template?: typeof Template,
  TemplateEvent?: typeof TemplateEvent,
  Test?: typeof Test,
  Tournament?: typeof Tournament,
  TournamentEvent?: typeof TournamentEvent,
} = {};
db.sequelize = sequelize;
db.Template = TemplateModel(sequelize);
db.TemplateEvent = TemplateEventModel(sequelize);
db.Test = TestModel(sequelize);
db.Tournament = TournamentModel(sequelize);
db.TournamentEvent = TournamentEventModel(sequelize);

db.Template.hasMany(db.TemplateEvent, {
  sourceKey: 'id',
  foreignKey: 'templateId',
  as: 'templateEvents',
});

db.Test.belongsTo(db.TournamentEvent, {
  as: 'tournamentEvent',
});

db.TournamentEvent.hasMany(db.Test, {
  sourceKey: 'id',
  foreignKey: 'tournamentEventId',
  as: 'tests',
});

db.Tournament.hasMany(db.Test, {
  sourceKey: 'id',
  foreignKey: 'tournamentId',
  as: 'tests',
});

db.Tournament.hasMany(db.TournamentEvent, {
  sourceKey: 'id',
  foreignKey: 'tournamentId',
  as: 'tournamentEvents',
});

module.exports = db;
export * from './TemplateModel';
export * from './TemplateEventModel';
export * from './TestModel';
export * from './TournamentEventModel';
export * from './TournamentModel';
