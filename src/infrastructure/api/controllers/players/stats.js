import { Players } from "../../../../application/services/index.js";
import { getBestCountry, getMedianOf, getPlayersAverageIMC } from "./helpers.js";

export const getPlayersStatsController = async (req, res, next) => {
    try {
        const foundPlayers = await Players.get();

        const bestCountry = getBestCountry(foundPlayers);
        const averageIMC = getPlayersAverageIMC(foundPlayers);
        const playersHeightList = foundPlayers.map((x) => x.data.height);
        const medianSize = getMedianOf(playersHeightList);

        res.json({ bestCountry, averageIMC, medianSize });
    } catch (error) {
        next(error);
    }
};
