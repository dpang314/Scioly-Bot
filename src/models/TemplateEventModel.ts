import { DataTypes, Model, Optional } from 'sequelize';

interface TemplateEventAttributes {
  id: string,
  name: string,
  minutes: number,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateEventCreationAttributes extends Optional<TemplateEventAttributes, 'id'> {}

class TemplateEvent extends Model<TemplateEventAttributes, TemplateEventCreationAttributes>
  implements TemplateEventAttributes {
  declare id: string;

  declare name: string;

  declare minutes: number;

  declare templateId: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

const TemplateEventModel = (sequelize) => {
  const templateEvent = TemplateEvent.init(
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
    },
  );

  return templateEvent;
};

module.exports = TemplateEventModel;
export { TemplateEvent };
export type { TemplateEventAttributes, TemplateEventCreationAttributes };
