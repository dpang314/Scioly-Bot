import {DataTypes, Model, Sequelize} from 'sequelize';
import * as Yup from 'yup';

interface TemplateEventAttributes {
  id: string;
  name: string;
  minutes: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateEventCreationAttributes
  extends Omit<TemplateEventAttributes, 'id'> {}

const templateEventCreationSchema: Yup.SchemaOf<TemplateEventCreationAttributes> =
  Yup.object({
    name: Yup.string().max(100, 'Must be 100 characters or less').required(),
    minutes: Yup.number()
      .min(0, "Test can't have a negative time limit")
      .max(1440, 'Test must be under 1440 minutes long')
      .required(),
  });

interface TemplateEventUpdateAttributes
  extends Partial<TemplateEventAttributes> {
  id: string;
}

const templateEventModificationSchema: Yup.SchemaOf<TemplateEventUpdateAttributes> =
  Yup.object({
    name: templateEventCreationSchema.fields.name.optional(),
    minutes: templateEventCreationSchema.fields.minutes.optional(),
    id: Yup.string().required(),
  });

class TemplateEvent
  extends Model<TemplateEventAttributes, TemplateEventCreationAttributes>
  implements TemplateEventAttributes
{
  declare id: string;

  declare name: string;

  declare minutes: number;

  declare templateId: string;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        minutes: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        tableName: 'template_events',
        timestamps: false,
      },
    );
  }
}

export default TemplateEvent;
export {templateEventCreationSchema, templateEventModificationSchema};
export type {
  TemplateEventAttributes,
  TemplateEventCreationAttributes,
  TemplateEventUpdateAttributes,
};
