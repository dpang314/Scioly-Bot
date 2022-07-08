import * as Yup from 'yup';
import {
  TournamentCreationAttributes,
  TournamentUpdateAttributes,
} from '../types';
import {nameSchema, urlSchema} from '../util';
import {tournamentEventCreationSchema} from './tournamentEvent';

const tournamentCreationSchema: Yup.SchemaOf<TournamentCreationAttributes> =
  Yup.object({
    name: nameSchema.required('Required'),
    active: Yup.boolean().required('Required'),
    submission: urlSchema.required('Required'),
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
