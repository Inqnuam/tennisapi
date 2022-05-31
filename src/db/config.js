import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV !== "development";
const isTesting = process.argv.includes("--isTesting");
const isSQL = process.env.DB_TYPE !== "mongodb";
const SQL_DB_NAME = isTesting ? process.env.SQL_TEST_DB_NAME : process.env.SQL_DB_NAME;
const SQL_DB_USER = process.env.SQL_DB_USER;
const SQL_DB_PASS = process.env.SQL_DB_PASS;
const SQL_DB_HOST = process.env.SQL_DB_HOST;
const SQL_DIALECT = process.env.DB_TYPE;

let fakeDB;
let sequelizeOptions = {
    host: SQL_DB_HOST,
    dialect: SQL_DIALECT,
};
let sequelize;

const connectToDB = async () => {
    if (isSQL) {
        if (isTesting || isProd) {
            sequelizeOptions.logging = false;
        }

        sequelize = new Sequelize(SQL_DB_NAME, SQL_DB_USER, SQL_DB_PASS, sequelizeOptions);

        if (isTesting) {
            await sequelize.sync({ force: true, alter: true });
        }
    } else {
        let URI = process.env.MONGO_URI;

        if (isTesting) {
            fakeDB = await MongoMemoryServer.create();
            URI = fakeDB.getUri();
        }

        await mongoose.connect(URI);
    }
};

const disconnectFromDB = async () => {
    if (isSQL) {
        if (isTesting) {
            await sequelize.sync({ force: true, alter: true });
        }
        await sequelize.close();
    } else {
        await mongoose.connection.close();
        if (isTesting) {
            await fakeDB.stop({ doCleanup: true });
        }
    }
};

const gracefulExit = () => {
    disconnectFromDB()
        .then(() => {
            if (!isTesting) process.exit(0);
        })
        .catch((err) => {
            if (!isTesting) process.exit(1);
        });
};
export { mongoose, connectToDB, disconnectFromDB, gracefulExit, sequelize };
