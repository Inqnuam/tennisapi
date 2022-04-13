import { Players } from "../../models/index.js";
import ServerError from "../../helpers/serverError.js";
export const addPlayerController = async (req, res, next) => {
    try {
        const addedPlayer = await createPlayer(req.body);
        res.json(addedPlayer);
    } catch (err) {
        next(err);
    }
};

export const createPlayer = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const foundPlayer = await Players.findOne({ id: body.id }, null, { strictQuery: true });
            if (foundPlayer) {
                throw new ServerError(409, "A player with the same id exists", ":(");
            }

            const addedPlayer = await Players.create(body);

            resolve(addedPlayer);
        } catch (error) {
            reject(error);
        }
    });
};
