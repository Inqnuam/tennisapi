import { config } from "dotenv";
config();

let PlayersDB;

const isSQL = process.env.DB_TYPE !== "mongodb";

if (isSQL) {
    const { Players } = await import("../db/sequelize/index.js");
    PlayersDB = Players;
} else {
    const { Players } = await import("../db/mongoose/index.js");
    PlayersDB = Players;
}

export const Players = {
    add: async (player) => {
        return await PlayersDB.add(player);
    },
    get: async () => {
        return await PlayersDB.get();
    },
    getById: async (id) => {
        return await PlayersDB.getById(id);
    },
    updateById: async (id, player) => {
        return await PlayersDB.updateById(id, player);
    },
    deleteById: async (id) => {
        return await PlayersDB.deleteById(id);
    },
};
