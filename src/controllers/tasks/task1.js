import { Players } from "../../models/index.js";
import ServerError from "../../helpers/serverError.js";

export const getPlayersList = async (req, res, next) => {
    try {
        const foundPlayers = await Players.find({}).sort({ "data.points": -1 });
        if (!foundPlayers) {
            throw new ServerError(404, "Players not found", "Joueurs introuvables");
        }
        res.json(foundPlayers);
    } catch (err) {
        next(err);
    }
};
