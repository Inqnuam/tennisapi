import { Players } from "../../../../application/services/index.js";

export const getPlayersController = async (req, res, next) => {
    try {
        const foundPlayers = await Players.get();

        res.json(foundPlayers);
    } catch (error) {
        next(error);
    }
};
