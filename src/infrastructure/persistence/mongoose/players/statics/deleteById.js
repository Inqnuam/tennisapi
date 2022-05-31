import ServerError from "../../../../../helpers/serverError.js";

export async function deleteById(id) {
    const deletedPlayer = await this.findOneAndDelete({ id: id }, { strictQuery: true });
    if (deletedPlayer) {
        return deletedPlayer.id;
    }

    throw new ServerError(404, "Unknown player", "Joueur introuvable");
}
