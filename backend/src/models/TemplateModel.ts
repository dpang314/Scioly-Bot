import {
  Association,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import TemplateEvent, {
  TemplateEventCreationAttributes,
  templateEventCreationSchema,
} from './TemplateEventModel';
import * as Yup from 'yup';

interface TemplateAttributes {
  id: string;
  name: string;
  templateEvents?: TemplateEventCreationAttributes[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateCreationAttributes extends Omit<TemplateAttributes, 'id'> {}

const templateCreationSchema: Yup.SchemaOf<TemplateCreationAttributes> =
  Yup.object({
    name: Yup.string().required(),
    templateEvents: Yup.array().of(templateEventCreationSchema).optional(),
  });

// template events must be updated individually to properly create/delete

interface TemplateUpdateAttributes
  extends Partial<Omit<TemplateAttributes, 'templateEvents'>> {
  id: string;
}

const templateUpdateSchema: Yup.SchemaOf<TemplateUpdateAttributes> = Yup.object(
  {
    id: Yup.string().required(),
    name: templateCreationSchema.fields.name.optional(),
  },
);

class Template
  extends Model<TemplateAttributes, TemplateCreationAttributes>
  implements TemplateAttributes
{
  declare id: string;

  declare name: string;

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
export {templateCreationSchema, templateUpdateSchema};
export type {TemplateAttributes, TemplateCreationAttributes, TemplateUpdateAttributes};
