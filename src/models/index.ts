import { Sequelize } from "sequelize";
import { DATABASE_CONNECTION } from '../configLoader';
import { TemplateModel } from "./TemplateModel";
import { TemplateEventModel } from "./TemplateEventModel";
import { TournamentModel } from "./TournamentModel";
import { TestModel } from "./TestModel";
import { TournamentEventModel } from "./TournamentEventModel";

const sequelize = new Sequelize(DATABASE_CONNECTION);

export const initDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
}

const Template = TemplateModel(sequelize);
const TemplateEvent = TemplateEventModel(sequelize);
const Test = TestModel(sequelize);
const Tournament = TournamentModel(sequelize);
const TournamentEvent = TournamentEventModel(sequelize);

Template.hasMany(TemplateEvent, {
  sourceKey: "id",
  foreignKey: "templateId",
  as: "templateEvents",
});

Tournament.hasMany(Test, {
  sourceKey: "id",
  foreignKey: "tournamentId",
  as: "tests",
});

Tournament.hasMany(TournamentEvent, {
  sourceKey: "id",
  foreignKey: "tournamentId",
  as: "tournamentEvents",
});

TournamentEvent.hasMany(Test, {
  sourceKey: "id",
  foreignKey: "tournamentEventId",
  as: "tournamentEvent"
})

export * from './TemplateModel';
export * from './TemplateEventModel';
export * from './TestModel';
export * from './TournamentEventModel';
export * from './TournamentModel';