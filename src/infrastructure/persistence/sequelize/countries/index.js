import { sequelize } from "../../../config/db.js";
import { Model } from "sequelize";
import { schema } from "./schema.js";

class Countries extends Model {}

Countries.init(schema, {
    sequelize,
    timestamps: false,
    modelName: "countries",
});
export { Countries };
