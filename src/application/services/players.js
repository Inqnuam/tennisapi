let repo = undefined;

export const setRepo = (_repo) => {
    if (repo) {
        return;
    }
    repo = _repo;
};

export const Players = {
    add: async (player) => {
        return await repo.add(player);
    },
    get: async () => {
        return await repo.get();
    },
    getById: async (id) => {
        return await repo.getById(id);
    },
    updateById: async (id, player) => {
        return await repo.updateById(id, player);
    },
    deleteById: async (id) => {
        return await repo.deleteById(id);
    },
};
