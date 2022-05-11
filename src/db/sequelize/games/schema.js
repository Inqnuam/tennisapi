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
    },
};
