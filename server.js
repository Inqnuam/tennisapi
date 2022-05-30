import express from "express";
import { connectToDB, gracefulExit } from "./src/db/config.js";
import { errorHandler, handle404 } from "./src/infra/api/middlewares/errorHandler/index.js";
import v1 from "./src/infra/api/routes/v1/dispatcher.js";
import { sequelize } from "./src/db/config.js";
import { Players } from "./src/application/services/players.js";

const isTesting = process.argv.includes("--isTesting");
const PORT = process.env.PORT;
const app = express();
const isSQL = process.env.DB_TYPE !== "mongodb";
const { Players: PlayersRepo } = await import(isSQL ? "./src/infra/persistence/sequelize/index.js" : "./src/infra/persistence/mongoose/index.js");

Players.setRepo(PlayersRepo);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/v1", v1);
app.use(errorHandler);
app.use(handle404);

connectToDB()
    .then(async () => {
        // Update SQL Tables
        // required for the first server launch ever:
        //await sequelize.sync({ force: true, alter: true });

        if (!isTesting) {
            const FREE_PORT = 0; // automatically assign a free port. Do not change.
            const server = app.listen(isNaN(PORT) ? FREE_PORT : PORT, () => {
                process.send("ready");
                const registeredPort = server.address().port;
                console.log(" ✅ Tennis API is online on http://localhost:" + registeredPort);
            });
        }
    })
    .catch((err) => {
        console.log(err);
        if (!isTesting) {
            process.exit(1);
        }
    });

process
    .on("message", (msg) => {
        if (msg == "shutdown") gracefulExit();
    })
    .on("SIGINT", gracefulExit)
    .on("SIGTERM", gracefulExit);
export { app, sequelize };
