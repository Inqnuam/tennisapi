import ServerError from "../../../../../helpers/serverError.js";

export async function getById(id) {
    const foundPlayer = await this.findOne({ id: id }, null, { strictQuery: true });
    if (foundPlayer) {
        return foundPlayer;
    } else {
        throw new ServerError(404, "Player not found", "Joueur introuvable");
    }
}
