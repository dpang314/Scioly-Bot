/* eslint-disable import/no-cycle */
import { Sequelize } from 'sequelize';
import { DATABASE_CONNECTION } from '../configLoader';

// eslint-disable-next-line import/no-mutable-exports
let sequelize: Sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(DATABASE_CONNECTION);
} else {
  if (!global.sequelize) {
    global.sequelize = new Sequelize(DATABASE_CONNECTION);
  }
  sequelize = global.sequelize;
}

export const initDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};

initDB();

export default sequelize;
