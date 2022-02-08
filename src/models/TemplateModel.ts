import { Optional, HasManyCreateAssociationMixin, Association, DataTypes, Model } from "sequelize";
import { TemplateEvent } from "./TemplateEventModel";

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
        templateEvents: Association<Template, TemplateEvent>;
      }
    }

const TemplateModel = (sequelize) => {
  Template.init(
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
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'templates',
    }
  )

  return Template;
}

export { TemplateModel, Template };
export type { TemplateAttributes, TemplateCreationAttributes };