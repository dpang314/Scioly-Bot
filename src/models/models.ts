/* eslint-disable max-classes-per-file */
import {
  Optional, Association, Model, HasManyCreateAssociationMixin, HasManyAddAssociationMixin,
} from 'sequelize';

interface TestAttributes {
  id: string,
  userId: string,
  partner1Id?: string,
  partner2Id?: string,
  timeStarted?: Date,
  finished: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TestCreationAttributes extends Optional<TestAttributes, 'id'> {}

class Test extends Model<TestAttributes, TestCreationAttributes> implements TestAttributes {
  declare id: string;

  declare userId: string;

  declare partner1Id: string | null;

  declare partner2Id: string | null;

  declare timeStarted: Date;

  declare finished: boolean;

  declare tournamentId: string;

  // eslint-disable-next-line no-use-before-define
  declare readonly tournamentEvent: TournamentEvent;

  declare tournamentEventId: string;
}

export { Test };
export type { TestAttributes, TestCreationAttributes };

interface TournamentEventAttributes {
  id: string,
  name: string,
  minutes: number,
  link: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TournamentEventCreationAttributes extends Optional<TournamentEventAttributes, 'id'> {}

class TournamentEvent extends Model<TournamentEventAttributes, TournamentEventCreationAttributes>
  implements TournamentEventAttributes {
  declare id: string;

  declare name: string;

  declare minutes: number;

  declare link: string;

  declare tournamentId: string;

  declare readonly tests?: Test[];

  declare static associations: {
      // eslint-disable-next-line no-use-before-define
      tests: Association<TournamentEvent, Test>;
    };

  declare createTest: HasManyCreateAssociationMixin<Test>;
}

export { TournamentEvent };
export type { TournamentEventAttributes, TournamentEventCreationAttributes };

interface TournamentAttributes {
  id: string,
  userId: string,
  name: string,
  active: boolean,
  submission: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TournamentCreationAttributes extends Optional<TournamentAttributes, 'id'> {}

class Tournament extends
  Model<TournamentAttributes, TournamentCreationAttributes> implements TournamentAttributes {
  declare id: string;

  declare userId: string;

  declare name: string;

  declare active: boolean;

  declare submission: string;

  declare readonly tournamentEvents?: TournamentEvent[];

  declare readonly tests?: Test[];

  declare static associations: {
    // eslint-disable-next-line no-use-before-define
    tournamentEvents: Association<Tournament, TournamentEvent>;
    // eslint-disable-next-line no-use-before-define
    tests: Association<Tournament, Test>;
  };

  declare createTournamentEvent: HasManyCreateAssociationMixin<TournamentEvent>;

  declare addTest: HasManyAddAssociationMixin<Test, number>;
}

export { Tournament };
export type { TournamentAttributes, TournamentCreationAttributes };

interface TemplateEventAttributes {
  id: string,
  name: string,
  minutes: number,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateEventCreationAttributes extends Optional<TemplateEventAttributes, 'id'> {}

class TemplateEvent extends Model<TemplateEventAttributes, TemplateEventCreationAttributes>
  implements TemplateEventAttributes {
  declare id: string;

  declare name: string;

  declare minutes: number;

  declare templateId: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

export { TemplateEvent };
export type { TemplateEventAttributes, TemplateEventCreationAttributes };

interface TemplateAttributes {
  id: string,
  name: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateCreationAttributes extends Optional<TemplateAttributes, 'id'> {}

class Template extends Model<TemplateAttributes, TemplateCreationAttributes>
  implements TemplateAttributes {
  declare id: string;

  declare name: string;

  declare createTemplateEvent: HasManyCreateAssociationMixin<TemplateEvent>;

  declare readonly templateEvents?: TemplateEvent[];

  declare static associations: {
        // eslint-disable-next-line no-use-before-define
        templateEvents: Association<Template, TemplateEvent>;
      };
}

export { Template };
export type { TemplateAttributes, TemplateCreationAttributes };
