import * as Yup from 'yup';
import {
  TournamentEventAttributes,
  TournamentEventCreationAttributes,
  tournamentEventCreationSchema,
} from './tournamentEvent';

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

const tournamentCreationSchema: Yup.SchemaOf<TournamentCreationAttributes> =
  Yup.object({
    name: Yup.string().max(100).required(),
    active: Yup.boolean().required(),
    submission: Yup.string().required(),
    tournamentEvents: Yup.array().of(tournamentEventCreationSchema).optional(),
  });

interface TournamentUpdateAttributes
  extends Partial<Omit<TournamentAttributes, 'tournamentEvents'>> {
  id: string;
}

const tournamentUpdateSchema: Yup.SchemaOf<TournamentUpdateAttributes> =
  Yup.object({
    id: Yup.string().required(),
    name: tournamentCreationSchema.fields.name.optional(),
    active: tournamentCreationSchema.fields.active.optional(),
    submission: tournamentCreationSchema.fields.submission.optional(),
  });

export {tournamentCreationSchema, tournamentUpdateSchema};
export type {
  TournamentAttributes,
  TournamentCreationAttributes,
  TournamentUpdateAttributes,
};
