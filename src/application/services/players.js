import { getBestCountry, getMedianOf, getPlayersAverageIMC } from "../../domain/services/players.func.js";

let playerRepo = undefined;

export const setRepo = (_playerRepo) => {
    if (playerRepo) {
        return;
    }
    playerRepo = _playerRepo;
};

export const Players = {
    add: async (player) => {
        return await playerRepo.add(player);
    },
    get: async () => {
        return await playerRepo.get();
    },
    getById: async (id) => {
        return await playerRepo.getById(id);
    },
    updateById: async (id, player) => {
        return await playerRepo.updateById(id, player);
    },
    deleteById: async (id) => {
        return await playerRepo.deleteById(id);
    },
    getStats: async () => {
        const foundPlayers = await playerRepo.get();

        const bestCountry = getBestCountry(foundPlayers);
        const averageIMC = getPlayersAverageIMC(foundPlayers);
        const playersHeightList = foundPlayers.map((x) => x.data.height);
        const medianSize = getMedianOf(playersHeightList);

        return { bestCountry, averageIMC, medianSize };
    },
};
