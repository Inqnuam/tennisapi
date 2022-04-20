import { Players } from "../../services/players.js";

export const getPlayerByIdController = async (req, res, next) => {
    try {
        const foundPlayer = await Players.getById(res.locals.id);

        res.json(foundPlayer);
    } catch (error) {
        next(error);
    }
};
