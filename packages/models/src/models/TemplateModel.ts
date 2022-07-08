import {
  Association,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import {TemplateAttributes, TemplateCreationAttributes} from 'scioly-bot-types';
import TemplateEvent from './TemplateEventModel';

class Template
  extends Model<TemplateAttributes, TemplateCreationAttributes>
  implements TemplateAttributes
{
  declare id: string;

  declare name: string;

  declare readonly userId?: string;

  declare getTemplateEvents: HasManyGetAssociationsMixin<TemplateEvent>;
  declare createTemplateEvent: HasManyCreateAssociationMixin<TemplateEvent>;

  declare readonly templateEvents?: TemplateEvent[];

  declare static associations: {
    // eslint-disable-next-line no-use-before-define
    templateEvents: Association<Template, TemplateEvent>;
  };

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'templates',
        timestamps: false,
      },
    );
  }
}

export default Template;
