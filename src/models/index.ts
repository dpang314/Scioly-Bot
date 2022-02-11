import { Sequelize } from 'sequelize';
import { Template, TemplateModel } from './TemplateModel';
import { TemplateEvent, TemplateEventModel } from './TemplateEventModel';
import { Tournament, TournamentModel } from './TournamentModel';
import { Test, TestModel } from './TestModel';
import { TournamentEvent, TournamentEventModel } from './TournamentEventModel';
import { DATABASE_CONNECTION } from '../configLoader';

let sequelize: Sequelize;

if (!global.sequelize) {
  global.sequelize = new Sequelize(DATABASE_CONNECTION);
}
// eslint-disable-next-line prefer-const
sequelize = global.sequelize;

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

export default db;
