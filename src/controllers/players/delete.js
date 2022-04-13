import { Players } from "../../models/index.js";
import ServerError from "../../helpers/serverError.js";

export const deletePlayerController = async (req, res, next) => {
    try {
        const deletedPlayer = await deletePlayerById(res.locals.id);
        res.json(deletedPlayer);
    } catch (err) {
        next(err);
    }
};

export const deletePlayerById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedPlayer = await Players.findOneAndDelete({ id: id }, { strictQuery: true });
            if (!deletedPlayer) throw new ServerError(404, "Unknown player", "Joueur introuvable");
            resolve({ deleted: deletedPlayer.id });
        } catch (error) {
            reject(error);
        }
    });
};
