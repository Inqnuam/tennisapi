import { Players } from "../../../../application/services/index.js";

export const addPlayerController = async (req, res, next) => {
    try {
        const addedPlayer = await Players.add(req.body);
        res.json(addedPlayer);
    } catch (err) {
        next(err);
    }
};
