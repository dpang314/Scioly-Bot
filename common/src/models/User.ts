import {
  DataTypes,
  Optional,
  Model,
  Sequelize,
  Association,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import Template from './TemplateModel';
import Tournament from './TournamentModel';

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

  declare readonly templates?: Template[];

  declare readonly tournaments?: Tournament[];

  declare getTournaments: HasManyGetAssociationsMixin<Tournament>;
  declare createTournament: HasManyCreateAssociationMixin<Tournament>;

  declare getTemplates: HasManyGetAssociationsMixin<Template>;
  declare createTemplate: HasManyCreateAssociationMixin<Template>;

  declare static associations: {
    tournaments: Association<User, Tournament>;
    templates: Association<User, Template>;
  };

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
