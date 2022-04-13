import { Players } from "../../models/index.js";
import ServerError from "../../helpers/serverError.js";
import { getBestCountry, getMedianOf, getPlayersAverageIMC } from "./helpers.js";

export const doTask3 = async (req, res, next) => {
    try {
        const foundPlayers = await Players.find();
        if (!foundPlayers) {
            throw new ServerError(404, "Players not found", "Joueurs introuvables");
        }
        const bestCountry = getBestCountry(foundPlayers);
        const averageIMC = getPlayersAverageIMC(foundPlayers);
        const playersHeightList = foundPlayers.map((x) => x.data.height);
        const medianSize = getMedianOf(playersHeightList);

        res.json({ bestCountry, averageIMC, medianSize });
    } catch (error) {
        next(error);
    }
};
