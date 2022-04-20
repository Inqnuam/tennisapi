import { sequelize } from "../../db/config.js";
import { INTEGER, STRING, ENUM, BIGINT, VIRTUAL, TEXT, Model } from "sequelize";
import { Games } from "./games.js";

class Data extends Model {}

Data.init(
    {
        id: {
            type: BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },

        rank: {
            type: INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        points: {
            type: INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        weight: {
            type: INTEGER,
            allowNull: false,
            validate: {
                min: { args: 10000, msg: "Vous croyez vraiment qu'un joueur ATP/WTP pese 10kg?" },
            },
        },
        height: {
            type: INTEGER,
            allowNull: false,
            validate: {
                min: { args: 20, msg: "Vous croyez vraiment qu'un joueur ATP/WTP mesure 20cm?" },
            },
        },
        last: {
            type: VIRTUAL,
            get() {
                return this.games.map((x) => x.result);
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "data",
    }
);

Data.hasMany(Games, { as: "games", allowNull: false, foreignKey: "datumId", onDelete: "CASCADE" });
export { Data };
