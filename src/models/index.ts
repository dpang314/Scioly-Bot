/* eslint-disable import/no-cycle */
import sequelize from './sequelize';
import { TemplateModel } from './TemplateModel';
import { TemplateEventModel } from './TemplateEventModel';
import { TournamentModel } from './TournamentModel';
import { TestModel } from './TestModel';
import { TournamentEventModel } from './TournamentEventModel';

const Template = TemplateModel(sequelize);
const TemplateEvent = TemplateEventModel(sequelize);
const Test = TestModel(sequelize);
const Tournament = TournamentModel(sequelize);
const TournamentEvent = TournamentEventModel(sequelize);

Template.hasMany(TemplateEvent, {
  sourceKey: 'id',
  foreignKey: 'templateId',
  as: 'templateEvents',
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

TournamentEvent.hasMany(Test, {
  sourceKey: 'id',
  foreignKey: 'tournamentEventId',
  as: 'tests',
});

Test.belongsTo(TournamentEvent, {
  as: 'tournamentEvent',
});

export * from './TemplateModel';
export * from './TemplateEventModel';
export * from './TestModel';
export * from './TournamentEventModel';
export * from './TournamentModel';
