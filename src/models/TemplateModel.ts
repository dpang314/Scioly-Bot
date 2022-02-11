import {
  DataTypes,
} from 'sequelize';
import { Template } from './models';

const TemplateModel = (sequelize) => {
  Template.init({
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

  return Template;
};

export default TemplateModel;
