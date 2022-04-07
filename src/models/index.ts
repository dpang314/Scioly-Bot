import 'pg';
import { Sequelize } from 'sequelize';
import { DATABASE_CONNECTION } from '../configLoader';
import { TemplateEventModel, TemplateEvent } from './TemplateEventModel';
import { TemplateModel, Template } from './TemplateModel';
import { TestModel, Test } from './TestModel';
import { TournamentEventModel, TournamentEvent } from './TournamentEventModel';
import { TournamentModel, Tournament } from './TournamentModel';

const sequelize: Sequelize = new Sequelize(DATABASE_CONNECTION, {
  logging: false,
});

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

export default db;
