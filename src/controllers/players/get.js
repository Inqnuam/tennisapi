import { Players } from "../../services/players.js";

export const getPlayersController = async (req, res, next) => {
    try {
        const foundPlayers = await Players.get();

        res.json(foundPlayers);
    } catch (error) {
        next(error);
    }
};
