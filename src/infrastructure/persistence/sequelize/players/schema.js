import { STRING, BIGINT, VIRTUAL, TEXT } from "sequelize";

export const schema = {
    id: {
        type: BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    firstname: {
        type: TEXT,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
        },
    },
    lastname: {
        type: TEXT,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
        },
    },
    picture: {
        type: STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
        },
    },
    birthday: {
        type: BIGINT,
        allowNull: false,
        // validate: {
        //     isNumeric: true,
        // },
    },
    sex: {
        type: STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [["F", "M"]],
                msg: "Must be F or M",
            },
        },
    },
    fullname: {
        type: VIRTUAL,
        get() {
            return `${this.firstname} ${this.lastname}`;
        },
    },
    shortname: {
        type: VIRTUAL,
        get() {
            if (this.lastname && this.firstname) {
                const lastname = this.lastname.length > 3 ? this.lastname.slice(0, 3) : this.lastname;
                return `${this.firstname.slice(0, 1)}.${lastname}`.toUpperCase();
            }
        },
    },
};
