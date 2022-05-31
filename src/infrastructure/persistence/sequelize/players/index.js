import { sequelize } from "../../../config/db.js";
import { Model } from "sequelize";
import { schema } from "./schema.js";
import { Countries } from "../countries/index.js";
import { Data } from "../data/index.js";
import { Games } from "../games/index.js";
import { calculateAge } from "../../../../domain/services/players.func.js";
import ServerError from "../../../api/errors/serverError.js";
import deleteById from "./statics/deleteById.js";
import options from "./queryOptions.js";

class Players extends Model {
    static #clearPlayerObject(player) {
        player.data.setDataValue("games", undefined);
        player.data.setDataValue("age", calculateAge(player.birthday));
        player.data.setDataValue("id", undefined);
        player.data.setDataValue("PlayerId", undefined);
        player.setDataValue("countryCode", undefined);

        return player;
    }

    static async get() {
        let allPlayers = await this.findAll(options);
        allPlayers = allPlayers.map((x) => this.#clearPlayerObject(x));

        return allPlayers;
    }

    static async getById(id) {
        let foundPlayer = await this.findByPk(id, options);

        if (foundPlayer) {
            return this.#clearPlayerObject(foundPlayer);
        }

        throw new ServerError(404, "Player not found", "Joueur introuvable");
    }
    static async add(body) {
        body.data.games = body.data.last.map((x) => {
            return { result: x };
        });

        let createOptions = {
            include: [
                {
                    model: Data,
                    as: "data",
                    include: [
                        {
                            model: Games,
                            as: "games",
                        },
                    ],
                },
            ],
        };

        if (!body.countryCode && body.country) {
            const foundCountry = await Countries.findByPk(body.country.code);

            if (foundCountry) {
                body.countryCode = foundCountry.code;
            } else {
                createOptions.include.push({ model: Countries });
            }
        }

        const createdPlayer = await this.create(body, createOptions);
        return this.#clearPlayerObject(createdPlayer);
    }

    static async updateById(id, body) {
        const t = await sequelize.transaction();

        try {
            const foundPlayer = await this.findByPk(id, options);

            if (!foundPlayer) {
                throw new ServerError(404, "Player not found", "Joueur introuvable");
            }

            let updatingData = body;

            delete updatingData.id;

            if (!updatingData.countryCode && updatingData.country) {
                const foundCountry = (await Countries.findByPk(updatingData.country.code)) ?? (await Countries.create(updatingData.country, { transaction: t }));

                if (foundCountry) {
                    updatingData.countryCode = foundCountry.code;
                }
                delete updatingData.country;
            }

            if (updatingData.data) {
                if (updatingData.data.last) {
                    if (!Array.isArray(updatingData.data.last)) {
                        throw new ServerError(404, "'data.last' must be an array");
                    }

                    await Promise.all(foundPlayer.data.games.map(async (x) => await x.destroy({ transaction: t })));

                    updatingData.data.games = updatingData.data.last.map((x) => {
                        return { result: x, datumId: foundPlayer.data.dataValues.id };
                    });

                    await Games.bulkCreate(updatingData.data.games, { transaction: t, validate: true });

                    delete updatingData.data.last;
                }

                Object.keys(updatingData.data).forEach((e) => {
                    foundPlayer.data.set(e, updatingData.data[e]);
                });

                await foundPlayer.data.save({ transaction: t });

                delete updatingData.data;
            }

            Object.keys(updatingData).forEach((e) => {
                foundPlayer.set(e, updatingData[e]);
            });

            const updatedPlayer = await foundPlayer.save({ ...options, transaction: t });
            await t.commit();

            // reload required to return values with correct types instead of client sent ones
            await updatedPlayer.reload(options);

            return this.#clearPlayerObject(updatedPlayer);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static deleteById = deleteById;
}

Players.init(schema, {
    timestamps: false,
    sequelize,
    modelName: "Players",
});

export { Players };
