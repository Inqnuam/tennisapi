import { sequelize } from "../../config.js";
import { Model } from "sequelize";
import { schema } from "./schema.js";

class Data extends Model {}

Data.init(schema, {
    sequelize,
    timestamps: false,
    modelName: "data",
});

export { Data };
