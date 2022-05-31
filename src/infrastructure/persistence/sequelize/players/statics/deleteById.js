import ServerError from "../../../../../helpers/serverError.js";

async function deleteById(id) {
    const count = await this.destroy({
        where: { id: id },
    });

    if (count === 1) {
        return id;
    }

    throw new ServerError(404, "Player not found", "Joueur introuvable");
}

export default deleteById;
