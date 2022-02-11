import {
  DataTypes,
} from 'sequelize';
import { TournamentEvent } from './models';

const TournamentEventModel = (sequelize) => {
  TournamentEvent.init(
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
      link: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: '',
      },
    },
    {
      sequelize,
      tableName: 'tournament_events',
    },
  );

  return TournamentEvent;
};

export default TournamentEventModel;
