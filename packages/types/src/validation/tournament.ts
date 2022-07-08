import * as Yup from 'yup';
import {
  TournamentCreationAttributes,
  TournamentUpdateAttributes,
} from '../types';
import {tournamentEventCreationSchema} from './tournamentEvent';

const tournamentCreationSchema: Yup.SchemaOf<TournamentCreationAttributes> =
  Yup.object({
    name: Yup.string().max(100).required(),
    active: Yup.boolean().required(),
    submission: Yup.string().required(),
    tournamentEvents: Yup.array().of(tournamentEventCreationSchema).optional(),
  });

const tournamentUpdateSchema: Yup.SchemaOf<TournamentUpdateAttributes> =
  Yup.object({
    id: Yup.string().required(),
    name: tournamentCreationSchema.fields.name.optional(),
    active: tournamentCreationSchema.fields.active.optional(),
    submission: tournamentCreationSchema.fields.submission.optional(),
  });

export {tournamentCreationSchema, tournamentUpdateSchema};
