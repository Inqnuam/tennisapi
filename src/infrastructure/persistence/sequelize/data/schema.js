import { INTEGER, BIGINT, VIRTUAL } from "sequelize";

export const schema = {
    id: {
        type: BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    rank: {
        type: INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    points: {
        type: INTEGER,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    weight: {
        type: INTEGER,
        allowNull: false,
        validate: {
            min: { args: 10000, msg: "Vous croyez vraiment qu'un joueur ATP/WTP pese 10kg?" },
        },
    },
    height: {
        type: INTEGER,
        allowNull: false,
        validate: {
            min: { args: 20, msg: "Vous croyez vraiment qu'un joueur ATP/WTP mesure 20cm?" },
        },
    },
    last: {
        type: VIRTUAL,
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error("Must be an array!");
                }
            },
        },
        get() {
            return this.games.map((x) => x.result);
        },
    },
};
