class PlayersService {
    setRepo(repo) {
        if (this.repo) {
            return;
        }
        this.repo = repo;
    }
    async add(player) {
        return await this.repo.add(player);
    }

    async get() {
        return await this.repo.get();
    }

    async getById(id) {
        return await this.repo.getById(id);
    }

    async updateById(id, player) {
        return await this.repo.updateById(id, player);
    }

    async deleteById(id) {
        return await this.repo.deleteById(id);
    }
}

export const Players = new PlayersService();
