import { sequelize } from "../../db/config.js";
import { INTEGER, STRING, ENUM, BIGINT, VIRTUAL, TEXT, Model } from "sequelize";

class Games extends Model {}

Games.init(
    {
        id: {
            type: BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        result: {
            type: INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "games",
    }
);

export { Games };
