import * as Yup from 'yup';
import {TestCreationAttributes, testCreationSchema} from './test';

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

const tournamentEventCreationSchema: Yup.SchemaOf<TournamentEventCreationAttributes> =
  Yup.object({
    name: Yup.string().max(100, 'Must be 100 characters or less').required(),
    minutes: Yup.number()
      .min(0, "Test can't have a negative time limit")
      .max(1440, 'Test must be under 1440 minutes long')
      .required(),
    link: Yup.string().required(),
    tests: Yup.array().of(testCreationSchema).optional(),
  });

interface TournamentEventUpdateAttributes
  extends Partial<Omit<TournamentEventAttributes, 'tests'>> {
  id: string;
}

const tournamentEventUpdateSchema: Yup.SchemaOf<TournamentEventUpdateAttributes> =
  Yup.object({
    id: Yup.string().required(),
    name: tournamentEventCreationSchema.fields.name.optional(),
    minutes: tournamentEventCreationSchema.fields.minutes.optional(),
    link: tournamentEventCreationSchema.fields.link.optional(),
  });

export {tournamentEventCreationSchema, tournamentEventUpdateSchema};
export type {
  TournamentEventAttributes,
  TournamentEventCreationAttributes,
  TournamentEventUpdateAttributes,
};
