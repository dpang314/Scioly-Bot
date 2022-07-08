import * as Yup from 'yup';
import {
  TournamentEventCreationAttributes,
  TournamentEventUpdateAttributes,
} from '../types';
import {minutesSchema, nameSchema, urlSchema} from '../util';
import {testCreationSchema} from './test';

const tournamentEventCreationSchema: Yup.SchemaOf<TournamentEventCreationAttributes> =
  Yup.object({
    name: nameSchema.required('Required'),
    minutes: minutesSchema.required('Required'),
    link: urlSchema.required('Required'),
    tests: Yup.array().of(testCreationSchema).optional(),
  });

const tournamentEventUpdateSchema: Yup.SchemaOf<TournamentEventUpdateAttributes> =
  Yup.object({
    id: Yup.string().required(),
    name: tournamentEventCreationSchema.fields.name.optional(),
    minutes: tournamentEventCreationSchema.fields.minutes.optional(),
    link: tournamentEventCreationSchema.fields.link.optional(),
  });

export {tournamentEventCreationSchema, tournamentEventUpdateSchema};
