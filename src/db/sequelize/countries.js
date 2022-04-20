import { sequelize } from "../config.js";
import { Sequelize, INTEGER, STRING, ENUM, BIGINT, TEXT, Model } from "sequelize";

class Countries extends Model {}

Countries.init(
    {
        code: {
            type: STRING(3),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true,
            },
        },
        picture: {
            type: STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "countries",
    }
);
export { Countries };
