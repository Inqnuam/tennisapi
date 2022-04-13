import fs from "fs";
import { exec } from "child_process";
import * as print from "../src/helpers/colorize.js";
import { readPort, readMongoURI, readApiKey } from "./getUserInputs.js";
const dotenv = await import("dotenv");
dotenv.config();
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
        envContent += `PORT=${data.PORT}\n`;
        envContent += `MONGO_URI="${data.MONGO_URI == "" ? "mongodb://...." : data.MONGO_URI}"\n`;
        envContent += `API_KEY="${data.API_KEY}"\n`;

        fs.writeFile(ENV_FILE_PATH, envContent, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

const init = async () => {
    const PORT = await readPort(parseInt(process.env.PORT));
    const MONGO_URI = await readMongoURI(process.env.MONGO_URI);
    const API_KEY = await readApiKey(process.env.API_KEY);
    await checkPM2();

    setEnvFile({ PORT, MONGO_URI, API_KEY })
        .then(() => {
            process.exit(0);
        })
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });
};

init();
