import { Players } from "../../services/players.js";

export const addPlayerController = async (req, res, next) => {
    try {
        const addedPlayer = await Players.add(req.body);
        res.json(addedPlayer);
    } catch (err) {
        next(err);
    }
};
