import {TestCreationAttributes} from '.';

interface TournamentEventAttributes {
  id: string;
  name: string;
  minutes: number;
  link: string;
  tests?: TestCreationAttributes[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TournamentEventCreationAttributes
  extends Omit<TournamentEventAttributes, 'id'> {}
interface TournamentEventUpdateAttributes
  extends Partial<Omit<TournamentEventAttributes, 'tests'>> {
  id: string;
}

export type {
  TournamentEventAttributes,
  TournamentEventCreationAttributes,
  TournamentEventUpdateAttributes,
};
