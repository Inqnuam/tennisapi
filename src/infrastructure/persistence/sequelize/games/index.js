import { sequelize } from "../../../../db/config.js";
import { Model } from "sequelize";
import { schema } from "./schema.js";

class Games extends Model {}

Games.init(schema, {
    sequelize,
    timestamps: false,
    modelName: "games",
});

export { Games };
