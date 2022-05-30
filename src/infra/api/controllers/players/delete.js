import { Players } from "../../../../application/services/index.js";

export const deletePlayerController = async (req, res, next) => {
    try {
        const deletedPlayerId = await Players.deleteById(res.locals.id);
        res.json({ deleted: deletedPlayerId });
    } catch (err) {
        next(err);
    }
};
