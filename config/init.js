import fs from "fs";
import { exec } from "child_process";
import * as print from "../src/helpers/colorize.js";
import { readPort, readMongoURI, readApiKey, readDBType, readDBName, readTestDBName, readDBUser, readDBPass, readDBHost } from "./getUserInputs.js";

const ENV_FILE_PATH = ".env";
const NODE_ENV = "development";

const checkPM2 = () => {
    return new Promise((resolve) => {
        exec("pm2 -v", (err, stdout, stderr) => {
            if (err || stderr) {
                print.CYAN("Please install PM2 globally before launching the server:");
                print.BR_BLUE("             npm install pm2 -g");
            }
            resolve();
        });
    });
};

const setEnvFile = async (data) => {
    return new Promise((resolve, reject) => {
        let envContent = `NODE_ENV="${NODE_ENV}"\n`;

        Object.keys(data).forEach((key) => {
            envContent += `${key}="${data[key]}"\n`;
        });

        fs.writeFile(ENV_FILE_PATH, envContent, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

const installDBPackage = async (db) => {
    let pacakgeName = "";
    switch (db) {
        case "mysql":
            pacakgeName = "mysql2";
            break;
        case "mariadb":
            pacakgeName = "mariadb";
            break;

        case "mssql":
            pacakgeName = "tedious";
            break;
        case "postgres":
            pacakgeName = "pg";
            break;
        case "sqlite":
            pacakgeName = "sqlite3";
            break;
        case "db2":
            pacakgeName = "ibm_db";
            break;
        case "snowflake":
            pacakgeName = "snowflake-sdk";
            break;
        default:
            return;
    }

    print.YELLOW("Please wait while installing DB dependencies...");
    return new Promise((resolve) => {
        exec(`npm i ${pacakgeName}`, (err, stdout, stderr) => {
            if (err || stderr) {
                print.RED(`Failed to install ${pacakgeName} package`);
                console.log(stderr);
            }
            resolve();
        });
    });
};

const init = async () => {
    // TODO: check if dotenv is installed
    const dotenv = await import("dotenv");
    dotenv.config();

    const PORT = await readPort(parseInt(process.env.PORT));
    const API_KEY = await readApiKey(process.env.API_KEY);
    const DB_TYPE = await readDBType(process.env.DB_TYPE);

    let MONGO_URI = "";
    let SQL_DB_NAME = "";
    let SQL_TEST_DB_NAME = "";
    let SQL_DB_USER = "";
    let SQL_DB_PASS = "";
    let SQL_DB_HOST = "";

    if (DB_TYPE == "mongodb") {
        MONGO_URI = await readMongoURI(process.env.MONGO_URI);
    } else {
        SQL_DB_NAME = await readDBName(process.env.SQL_DB_NAME);
        SQL_TEST_DB_NAME = await readTestDBName(process.env.SQL_TEST_DB_NAME, SQL_DB_NAME);
        SQL_DB_USER = await readDBUser(process.env.SQL_DB_USER);
        SQL_DB_PASS = await readDBPass(process.env.SQL_DB_PASS);
        SQL_DB_HOST = await readDBHost(process.env.SQL_DB_HOST);

        await installDBPackage(DB_TYPE);
    }

    await checkPM2();

    setEnvFile({ PORT, MONGO_URI, API_KEY, DB_TYPE, SQL_DB_NAME, SQL_TEST_DB_NAME, SQL_DB_USER, SQL_DB_PASS, SQL_DB_HOST })
        .then(() => {
            process.exit(0);
        })
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });
};

init();
