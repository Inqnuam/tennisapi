import { Players } from "../../../../application/services/index.js";

export const updatePlayerController = async (req, res, next) => {
    try {
        const updatedPlayer = await Players.updateById(res.locals.id, req.body);

        res.json(updatedPlayer);
    } catch (err) {
        next(err);
    }
};
