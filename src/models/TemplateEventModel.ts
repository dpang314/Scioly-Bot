import { DataTypes } from 'sequelize';
import { TemplateEvent } from './models';

const TemplateEventModel = (sequelize) => {
  TemplateEvent.init(
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

  return TemplateEvent;
};

export default TemplateEventModel;
