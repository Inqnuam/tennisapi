import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const isProd = process.env.NODE_ENV !== "development";
const isTesting = process.argv.includes("--isTesting");
const SQL_DB_NAME = isTesting ? process.env.SQL_TEST_DB_NAME : process.env.SQL_DB_NAME;
const SQL_DB_USER = process.env.SQL_DB_USER;
const SQL_DB_PASS = process.env.SQL_DB_PASS;
const SQL_DB_HOST = process.env.SQL_DB_HOST;
const SQL_DIALECT = process.env.DB_TYPE;

let sequelizeOptions = {
    host: SQL_DB_HOST,
    dialect: SQL_DIALECT,
};

export const connectToSQL = async () => {
    if (isTesting || isProd) {
        sequelizeOptions.logging = false;
    }

    const sequelize = new Sequelize(SQL_DB_NAME, SQL_DB_USER, SQL_DB_PASS, sequelizeOptions);

    if (isTesting) {
        await sequelize.sync({ force: true, alter: true });
    }

    return sequelize;
};
