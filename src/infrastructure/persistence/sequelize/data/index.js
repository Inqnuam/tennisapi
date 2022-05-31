import { sequelize } from "../../../../db/config.js";
import { Model } from "sequelize";
import { schema } from "./schema.js";

class Data extends Model {}

Data.init(schema, {
    sequelize,
    timestamps: false,
    modelName: "data",
});

export { Data };
