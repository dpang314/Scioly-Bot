import { DataTypes } from 'sequelize';
import { Tournament } from './models';

const TournamentModel = (sequelize) => {
  Tournament.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      submission: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'tournaments',
    },
  );

  return Tournament;
};

export default TournamentModel;
