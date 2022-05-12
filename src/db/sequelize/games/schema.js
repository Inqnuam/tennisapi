import { INTEGER, BIGINT } from "sequelize";

export const schema = {
    id: {
        type: BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    result: {
        type: INTEGER,
        allowNull: false,
        validate: {
            isIn: {
                args: [[0, 1]],
                msg: "Must be 0 or 1",
            },
        },
    },
};
