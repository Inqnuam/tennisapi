import { sequelize } from "../../config.js";
import { Model } from "sequelize";
import { schema } from "./schema.js";
import { Countries } from "../countries/index.js";
import { Data } from "../data/index.js";
import { Games } from "../games/index.js";
import { calculateAge } from "../../../helpers/calculateAge.js";
import ServerError from "../../../helpers/serverError.js";
import deleteById from "./statics/deleteById.js";
import options from "./queryOptions.js";

class Players extends Model {
    static #clearPlayerObject(player, isNew = false) {
        player.data.setDataValue("games", undefined);
        player.data.setDataValue("age", calculateAge(player.birthday));

        if (isNew) {
            player.data.setDataValue("id", undefined);
            player.data.setDataValue("PlayerId", undefined);
            player.setDataValue("countryCode", undefined);
        }

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
        return this.#clearPlayerObject(createdPlayer, true);
    }

    static async updateById(id, body) {
        const foundPlayer = await this.findByPk(id, options);

        if (!foundPlayer) {
            throw new ServerError(404, "Player not found", "Joueur introuvable");
        }

        let updatingData = body;

        delete updatingData.id;

        if (!body.countryCode && body.country) {
            const foundCountry = (await Countries.findByPk(body.country.code)) ?? (await Countries.create(body.country));

            if (foundCountry) {
                updatingData.countryCode = foundCountry.code;
            }
            delete updatingData.country;
        }

        if (body.data) {
            if (updatingData.data.last) {
                updatingData.data.games = body.data.last.map((x) => {
                    return { result: x };
                });
                delete updatingData.last;
            }

            Object.keys(updatingData.data).forEach((e) => {
                foundPlayer.data.set(e, updatingData.data[e]);
            });

            delete updatingData.data;
        }

        Object.keys(updatingData).forEach((e) => {
            foundPlayer.set(e, `${updatingData[e]}`);
        });

        const updatedPlayer = await foundPlayer.save(options);

        return this.#clearPlayerObject(updatedPlayer);
    }

    static deleteById = deleteById;
}

Players.init(schema, {
    timestamps: false,
    sequelize,
    modelName: "Players",
});

export { Players };
