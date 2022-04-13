import express from "express";
import { connectToMongoDB, gracefulExit } from "./src/db/config.js";
import { errorHandler, handle404 } from "./src/middlewares/errorHandler/index.js";
import v1 from "./src/routes/v1/dispatcher.js";

const PORT = process.env.PORT;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/v1", v1);
app.use(errorHandler);
app.use(handle404);

connectToMongoDB()
    .then(() => {
        if (!process.env.TEST) {
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
        if (!process.env.TEST) {
            process.exit(1);
        }
    });

process
    .on("message", (msg) => {
        if (msg == "shutdown") gracefulExit();
    })
    .on("SIGINT", gracefulExit)
    .on("SIGTERM", gracefulExit);
export { app };
