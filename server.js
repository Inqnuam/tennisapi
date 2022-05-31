import express from "express";
import { connectToDB, gracefulExit } from "./src/infrastructure/config/db.js";
import { errorHandler, handle404 } from "./src/infrastructure/api/middlewares/errorHandler/index.js";
import v1 from "./src/infrastructure/api/routes/v1/dispatcher.js";
import { setRepo } from "./src/application/services/players.js";

const isTesting = process.argv.includes("--isTesting");
const PORT = process.env.PORT;
const isSQL = process.env.DB_TYPE !== "mongodb";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

try {
    await connectToDB(isSQL);

    let PlayersRepo;

    if (isSQL) {
        const { Players: playersRepo } = await import("./src/infrastructure/persistence/sequelize/index.js");
        PlayersRepo = playersRepo;
    } else {
        const { Players: playersRepo } = await import("./src/infrastructure/persistence/mongoose/index.js");
        PlayersRepo = playersRepo;
    }

    setRepo(PlayersRepo);

    app.use("/v1", v1);
    app.use(errorHandler);
    app.use(handle404);

    if (!isTesting) {
        const FREE_PORT = 0; // automatically assign a free port. Do not change.
        const server = app.listen(isNaN(PORT) ? FREE_PORT : PORT, () => {
            process.send("ready");
            const registeredPort = server.address().port;
            console.log(" ✅ Tennis API is online on http://localhost:" + registeredPort);
        });
    }
} catch (err) {
    console.log(err);
    if (!isTesting) {
        process.exit(1);
    }
}

process
    .on("message", (msg) => {
        if (msg == "shutdown") {
            gracefulExit();
        }
    })
    .on("SIGINT", gracefulExit)
    .on("SIGTERM", gracefulExit);

export { app };
