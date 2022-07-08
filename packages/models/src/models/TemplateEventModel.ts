import {DataTypes, Model, Sequelize} from 'sequelize';
import {
  TemplateEventAttributes,
  TemplateEventCreationAttributes,
} from 'scioly-bot-types';

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
