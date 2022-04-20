import { sequelize } from "../../db/config.js";
import { INTEGER, STRING, ENUM, BIGINT, VIRTUAL, TEXT, Model } from "sequelize";
import { Countries } from "./countries.js";
import { Data } from "./data.js";
import { Games } from "./games.js";
import { calculateAge } from "../../helpers/calculateAge.js";
import ServerError from "../../helpers/serverError.js";

const options = {
    include: [
        {
            model: Countries,
            attributes: ["code", "picture"],
        },
        {
            model: Data,
            as: "data",
            attributes: { exclude: ["id", "PlayerId"] },
            include: {
                model: Games,
                as: "games",
                attributes: {
                    exclude: ["datumId", "id"],
                },
            },
        },
    ],
    attributes: {
        exclude: ["countryCode", "dataId"],
    },
    order: [
        [
            {
                model: Data,
                as: "data",
            },
            "points",
            "DESC",
        ],
    ],
};

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

        let options = {
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
                options.include.push({ model: Countries });
            }
        }

        const createdPlayer = await Players.create(body, options);
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
    static async deleteById(id) {
        const count = await this.destroy({
            where: { id: id },
        });

        if (count === 1) {
            return id;
        }

        throw new ServerError(404, "Player not found", "Joueur introuvable");
    }
}

Players.init(
    {
        id: {
            type: BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        firstname: {
            type: TEXT,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        lastname: {
            type: TEXT,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        picture: {
            type: TEXT,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        birthday: {
            type: BIGINT,
            allowNull: false,
        },
        sex: {
            type: STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [["F", "M"]],
                    msg: "Must be F or M",
                },
            },
        },
        fullname: {
            type: VIRTUAL,
            get() {
                return `${this.firstname} ${this.lastname}`;
            },
        },
        shortname: {
            type: VIRTUAL,
            get() {
                if (this.lastname && this.firstname) {
                    const lastname = this.lastname.length > 3 ? this.lastname.slice(0, 3) : this.lastname;
                    return `${this.firstname.slice(0, 1)}.${lastname}`.toUpperCase();
                }
            },
        },
    },
    {
        timestamps: false,
        sequelize,
        modelName: "Players",
    }
);

Players.belongsTo(Countries, { allowNull: false, foreignKey: "countryCode" });

Players.hasOne(Data, { as: "data", foreignKey: "PlayerId", onDelete: "cascade" });
Data.belongsTo(Players);
export { Players };
