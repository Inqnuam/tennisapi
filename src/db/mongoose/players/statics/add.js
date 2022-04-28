import ServerError from "../../../../helpers/serverError.js";

export async function add(player) {
    const foundPlayer = await this.findOne({ id: player.id }, null, { strictQuery: true });
    if (foundPlayer) {
        throw new ServerError(409, "A player with the same id exists", ":(");
    }

    return await this.create(player);
}
