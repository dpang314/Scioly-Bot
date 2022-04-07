import {
  Association,
  DataTypes, HasManyCreateAssociationMixin, Model, Optional, Sequelize,
} from 'sequelize';
import TemplateEvent from './TemplateEventModel';

interface TemplateAttributes {
  id: string,
  name: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateCreationAttributes extends Optional<TemplateAttributes, 'id'> {}

class Template extends Model<TemplateAttributes, TemplateCreationAttributes>
  implements TemplateAttributes {
  declare id: string;

  declare name: string;

  declare createTemplateEvent: HasManyCreateAssociationMixin<TemplateEvent>;

  declare readonly templateEvents?: TemplateEvent[];

  declare static associations: {
        // eslint-disable-next-line no-use-before-define
        templateEvents: Association<Template, TemplateEvent>;
      };

  public static initialize(sequelize: Sequelize) {
    this.init({
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
    }, {
      sequelize,
      tableName: 'templates',
    });
  }
}

export default Template;
export type { TemplateAttributes, TemplateCreationAttributes };
