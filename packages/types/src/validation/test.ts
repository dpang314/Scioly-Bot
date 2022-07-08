import * as Yup from 'yup';

interface TestAttributes {
  id: string;
  userId: string;
  partner1Id?: string;
  partner2Id?: string;
  timeStarted?: Date;
  finished: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TestCreationAttributes extends Omit<TestAttributes, 'id'> {}

const testCreationSchema: Yup.SchemaOf<TestCreationAttributes> = Yup.object({
  userId: Yup.string().required(),
  partner1Id: Yup.string().optional(),
  partner2Id: Yup.string().optional(),
  timeStarted: Yup.date().optional(),
  finished: Yup.boolean().required(),
});

export {testCreationSchema};
export type {TestAttributes, TestCreationAttributes};
