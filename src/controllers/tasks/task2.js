import { Players } from "../../models/index.js";
import ServerError from "../../helpers/serverError.js";

export const getPlayerById = async (req, res, next) => {
    try {
        const foundPlayer = await Players.findOne({ id: res.locals.id }, null, { strictQuery: true });
        if (!foundPlayer) {
            throw new ServerError(404, "Player not found", "Joueur introuvable");
        }
        res.json(foundPlayer);
    } catch (err) {
        next(err);
    }
};
