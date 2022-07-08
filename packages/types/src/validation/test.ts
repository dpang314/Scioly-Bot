import * as Yup from 'yup';
import {TestCreationAttributes} from '../types';

const testCreationSchema: Yup.SchemaOf<TestCreationAttributes> = Yup.object({
  userId: Yup.string().required(),
  partner1Id: Yup.string().optional(),
  partner2Id: Yup.string().optional(),
  timeStarted: Yup.date().optional(),
  finished: Yup.boolean().required(),
});

export {testCreationSchema};
