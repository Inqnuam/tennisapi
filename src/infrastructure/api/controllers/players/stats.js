import { Players } from "../../../../application/services/index.js";

export const getPlayersStatsController = async (req, res, next) => {
    try {
        const tennisStats = await Players.getStats();

        res.json(tennisStats);
    } catch (error) {
        next(error);
    }
};
