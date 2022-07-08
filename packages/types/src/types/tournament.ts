import {TournamentEventAttributes, TournamentEventCreationAttributes} from '.';

interface TournamentAttributes {
  id: string;
  name: string;
  active: boolean;
  submission: string;
  tournamentEvents?: TournamentEventAttributes[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TournamentCreationAttributes
  extends Omit<TournamentAttributes, 'id' | 'tournamentEvents'> {
  tournamentEvents?: TournamentEventCreationAttributes[];
}

interface TournamentUpdateAttributes
  extends Partial<Omit<TournamentAttributes, 'tournamentEvents'>> {
  id: string;
}

export type {
  TournamentAttributes,
  TournamentCreationAttributes,
  TournamentUpdateAttributes,
};
