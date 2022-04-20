import { Players } from "../../services/players.js";

export const deletePlayerController = async (req, res, next) => {
    try {
        const deletedPlayerId = await Players.deleteById(res.locals.id);
        res.json({ deleted: deletedPlayerId });
    } catch (err) {
        next(err);
    }
};
