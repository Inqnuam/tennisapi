import { Countries } from "./countries/index.js";
import { Players } from "./players/index.js";
import { Data } from "./data/index.js";
import { Games } from "./games/index.js";

Players.belongsTo(Countries, { allowNull: false, foreignKey: "countryCode" });
Players.hasOne(Data, { as: "data", foreignKey: "PlayerId", onDelete: "cascade" });
Data.belongsTo(Players);
Data.hasMany(Games, { as: "games", allowNull: false, foreignKey: "datumId", onDelete: "CASCADE" });

export { Players, Countries, Data, Games };
