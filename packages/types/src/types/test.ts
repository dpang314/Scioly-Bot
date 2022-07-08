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

export type {TestAttributes, TestCreationAttributes};
