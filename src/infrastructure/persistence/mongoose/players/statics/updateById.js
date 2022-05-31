import ServerError from "../../../../../helpers/serverError.js";

export async function updateById(id, body) {
    const foundPlayer = await this.findOne({ id: id }, null, { strictQuery: true });

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

    return updatedPlayer;
}
