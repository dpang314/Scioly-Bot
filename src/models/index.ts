import 'pg';
import { Sequelize } from 'sequelize';
import TemplateModel from './TemplateModel';
import TemplateEventModel from './TemplateEventModel';
import TournamentModel from './TournamentModel';
import TestModel from './TestModel';
import TournamentEventModel from './TournamentEventModel';
import {
  Template, TemplateEvent, Test, Tournament, TournamentEvent,
} from './models';
import { DATABASE_CONNECTION } from '../configLoader';

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

db.Template.hasMany(TemplateEvent, {
  sourceKey: 'id',
  foreignKey: 'templateId',
  as: 'templateEvents',
});

db.Test.belongsTo(TournamentEvent, {
  as: 'tournamentEvent',
});

db.TournamentEvent.hasMany(Test, {
  sourceKey: 'id',
  foreignKey: 'tournamentEventId',
  as: 'tests',
});

db.Tournament.hasMany(Test, {
  sourceKey: 'id',
  foreignKey: 'tournamentId',
  as: 'tests',
});

db.Tournament.hasMany(TournamentEvent, {
  sourceKey: 'id',
  foreignKey: 'tournamentId',
  as: 'tournamentEvents',
});

module.exports = db;
