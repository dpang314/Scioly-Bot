import { Sequelize } from 'sequelize';
import { DATABASE_HOST, DATABASE_PORT } from './configLoader';

const sequelize = new Sequelize('postgres', process.env['DATABASE_USERNAME'], process.env['DATABASE_PASSWORD'], {
    logging: false,
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'postgres',
});

export default sequelize;