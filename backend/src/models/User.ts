import {DataTypes, Optional, Model, Sequelize} from 'sequelize';

interface UserAttributes {
  id: string;
  discordName: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;

  declare discordName: string;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.TEXT,
          unique: true,
        },
        discordName: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'users',
      },
    );
  }
}

export default User;
export type {UserAttributes, UserCreationAttributes};
