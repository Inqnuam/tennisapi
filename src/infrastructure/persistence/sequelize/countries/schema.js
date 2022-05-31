import { STRING } from "sequelize";

export const schema = {
    code: {
        type: STRING(3),
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true,
        },
    },
    picture: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
};
