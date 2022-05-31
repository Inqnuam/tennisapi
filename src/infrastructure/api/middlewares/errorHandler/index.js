import mongoose from "mongoose";
import ServerError from "../../errors/serverError.js";
import { handle404 } from "./handle404.js";
const errorHandler = (err, req, res, next) => {
    const sendingErrors = [];
    switch (err.constructor) {
        case SyntaxError:
            const msg = err.status === 400 && "body" in err ? err.message : "SyntaxError";

            res.status(400).json({ error: { dev: msg, cli: ":(" } });

            break;
        case ServerError:
            res.status(err.code).json({ error: { dev: err.message, cli: err.clientMsg } });
            break;

        case mongoose.Error.ValidationError:
            if (err.errors) {
                Object.keys(err.errors).forEach((el) => {
                    sendingErrors.push(err.errors[el].message);
                });
            }
            res.status(400).json({ error: { dev: sendingErrors.join(", "), cli: "Valeurs incorrectes" } });

            break;

        case mongoose.Error.MongoAPIError:
            res.status(503).json({ error: { dev: err.message, cli: "Erreur interne" } });

            break;
        default:
            if (Array.isArray(err.errors)) {
                err.errors.forEach((el) => {
                    if (el.path) {
                        sendingErrors.push(`path:'${el.path}' ${el.message}! Received (${typeof el.value}) ${el.value}`);
                    } else if (el.errors && Array.isArray(el.errors.errors)) {
                        el.errors.errors.forEach((childError) => {
                            sendingErrors.push(`path:'${childError.path}' ${childError.message}! Received (${typeof childError.value}) ${childError.value}`);
                        });
                    }
                });

                res.status(400).json({ error: { dev: sendingErrors.join(", "), cli: "Valeurs incorrectes" } });
            } else {
                res.status(400).json({ error: { dev: err.message ?? "Bad Request", cli: ":(" } });
            }

            break;
    }
};

export { handle404, errorHandler };
