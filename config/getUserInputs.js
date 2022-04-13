import readline from "readline";
import * as print from "../src/helpers/colorize.js";

const DEFAULT_API_KEY = "superSecret";
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
    else print.GREEN("✅ API_KEY");
    return API_KEY;
}

export { readPort, readMongoURI, readApiKey };
