import { Players } from "../../../../application/services/index.js";

export const getPlayerByIdController = async (req, res, next) => {
    try {
        const foundPlayer = await Players.getById(res.locals.id);

        res.json(foundPlayer);
    } catch (error) {
        next(error);
    }
};
