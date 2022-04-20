import readline from "readline";
import * as print from "../src/helpers/colorize.js";

const DEFAULT_API_KEY = "tennisIsCool";
const FREE_PORT = 0; // do not overwrite

const leadNTrailQuotes = /(^("|')|("|')$)/g;
const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    error: process.stderr,
});

const ask = (msg, defaultVal = null) =>
    new Promise((resolve) => {
        reader.question(`\x1b[34m${msg}\x1b[0m`, (res) => {
            return resolve(res.length > 0 ? res : defaultVal);
        });
    });

async function readPort(previousValue) {
    let msg = "Please enter a PORT between 1024 and 49151\n";
    msg += isNaN(previousValue) ? "or press enter to use an empty port: " : `press enter to use last used port ${previousValue}: `;

    const userInput = await ask(msg, isNaN(previousValue) ? FREE_PORT : previousValue);

    const PORT = isNaN(userInput) ? FREE_PORT : userInput;
    if (PORT === FREE_PORT) print.YELLOW("A free port will be assigned during server start-up\n");
    else print.GREEN(`✅ PORT: ${PORT}\n`);
    return PORT;
}

async function readMongoURI(previousValue) {
    let msg = "Please provide MongoDB connection URI for database 'TestTechnique'\n";
    msg += previousValue ? `Leave empty to use last used URI: ` : "See URI examples at https://www.mongodb.com/docs/manual/reference/connection-string/ : ";

    let mongoURI = await ask(msg, previousValue ?? "");

    mongoURI = mongoURI.trim().replace(leadNTrailQuotes, "");

    if (mongoURI == "") print.YELLOW("❌ MongoDB URI is missing!\nDo not forget to set it in .env before starting the server\n");
    else print.GREEN(`✅ MONGO_URI: ${mongoURI}\n`);
    return mongoURI;
}

async function readApiKey(previousValue) {
    let msg = "Please define a secret key for CUD operations";
    msg += previousValue ? `\nLeave empty to use last used key: ` : ": ";

    const API_KEY = await ask(msg, previousValue ?? DEFAULT_API_KEY);

    if (API_KEY == DEFAULT_API_KEY) print.YELLOW("❌ Default API key will be used\n");
    else print.GREEN("✅ API_KEY\n");
    return API_KEY;
}

async function readDBType(previousValue) {
    const dbs = ["mongodb", "mysql", "mariadb", "mssql", "postgres", "sqlite", "db2", "snowflake"];

    let msg = "Which database are you going to use ?";
    msg += previousValue ? `\nLeave empty to use last used db: ` : ": ";

    print.CYAN(msg);
    let userInput = "";

    while (userInput == "") {
        const userIn = await ask("- " + dbs.join("\n- ") + ": ", previousValue ?? "");

        const cleanedInput = userIn.trim().toLowerCase();
        if (dbs.includes(cleanedInput)) {
            print.GREEN(`✅ DB_TYPE: ${cleanedInput}\n`);
            userInput = cleanedInput;
            break;
        } else {
            print.RED(`'${userIn}' is not supported\n`);
        }
    }

    return userInput;
}

async function readDBName(previousValue) {
    let msg = "Please provide DB name";
    msg += previousValue ? `\nLeave empty to use last used name: ` : ": ";

    const SQL_DB_NAME = await ask(msg, previousValue ?? "");

    if (SQL_DB_NAME.trim() == "") print.YELLOW("❌ set it later in .env\n");
    else print.GREEN(`✅ SQL_DB_NAME: ${SQL_DB_NAME.trim()}\n`);
    return SQL_DB_NAME.trim();
}

async function readTestDBName(previousValue, SQL_DB_NAME) {
    let msg = "Please provide TEST DB name";
    msg += previousValue ? `\nLeave empty to use last used name: ` : ": ";

    let SQL_TEST_DB_NAME = await ask(msg, previousValue ?? "");
    SQL_TEST_DB_NAME = SQL_TEST_DB_NAME.trim();
    if (SQL_TEST_DB_NAME == "") print.YELLOW("❌ set it later in .env\n");
    else if (SQL_TEST_DB_NAME == SQL_DB_NAME) {
        print.YELLOW("❌ Can't use the same database for testing\n");
        return "";
    } else {
        print.GREEN(`✅ SQL_TEST_DB_NAME: ${SQL_TEST_DB_NAME}\n`);
    }

    return SQL_TEST_DB_NAME;
}
async function readDBUser(previousValue) {
    let msg = "Please provide DB username";
    msg += previousValue ? `\nLeave empty to use last used username: ` : ": ";

    const SQL_DB_USER = await ask(msg, previousValue ?? "");

    if (SQL_DB_USER.trim() == "") print.YELLOW("❌ set it later in .env\n");
    else print.GREEN(`✅ SQL_DB_USER: ${SQL_DB_USER.trim()}\n`);
    return SQL_DB_USER.trim();
}

async function readDBPass(previousValue) {
    let msg = "Please provide DB user password";
    msg += previousValue ? `\nLeave empty to use last used pasword: ` : ": ";

    const SQL_DB_PASS = await ask(msg, previousValue ?? "");

    if (SQL_DB_PASS.trim() == "") print.YELLOW("❌ set it later in .env\n");
    else print.GREEN(`✅ SQL_DB_PASS: ${SQL_DB_PASS.trim()}\n`);
    return SQL_DB_PASS.trim();
}

async function readDBHost(previousValue) {
    let msg = "Please provide DB hostname";
    msg += previousValue ? `\nLeave empty to use last hostname: ` : ": ";

    const SQL_DB_HOST = await ask(msg, previousValue ?? "localhost");

    if (SQL_DB_HOST.trim() == "") print.YELLOW("❌ set it later in .env\n");
    else print.GREEN(`✅ SQL_DB_HOST: ${SQL_DB_HOST.trim()}\n`);
    return SQL_DB_HOST.trim();
}

export { readPort, readMongoURI, readApiKey, readDBType, readDBName, readTestDBName, readDBUser, readDBPass, readDBHost };
