interface UserAttributes {
  id: string;
  discordName: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserCreationAttributes extends UserAttributes {}

export type {UserAttributes, UserCreationAttributes};
