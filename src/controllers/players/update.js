import { Players } from "../../models/index.js";
import ServerError from "../../helpers/serverError.js";

export const updatePlayerController = async (req, res, next) => {
    try {
        const updatedPlayer = await updatePlayerBydId(res.locals.id, req.body);

        res.json(updatedPlayer);
    } catch (err) {
        next(err);
    }
};

export const updatePlayerBydId = (id, body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const foundPlayer = await Players.findOne({ id: id }, null, { strictQuery: true });
            if (!foundPlayer) {
                throw new ServerError(404, "Incorrect id", "Joueur introuvable");
            }

            let updatingData = body;

            if (body.country) {
                Object.keys(body.country).forEach((e) => {
                    updatingData[`country.${e}`] = body.country[e];
                });

                delete updatingData.country;
            }

            if (body.data) {
                Object.keys(body.data).forEach((e) => {
                    updatingData[`data.${e}`] = body.data[e];
                });

                delete updatingData.data;
            }

            foundPlayer.set(updatingData);
            const updatedPlayer = await foundPlayer.save();

            resolve(updatedPlayer);
        } catch (error) {
            reject(error);
        }
    });
};
