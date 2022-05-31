import mongoose from "mongoose";
import { calculateAge } from "../../../../domain/services/players.func.js";
import { schemaObject } from "./schema.js";
import { updateById } from "./statics/updateById.js";
import { add } from "./statics/add.js";
import { deleteById } from "./statics/deleteById.js";
import { get } from "./statics/get.js";
import { getById } from "./statics/getById.js";

const options = {
    toObject: {
        transform(doc, ret) {
            delete ret._id;
        },
    },
    toJSON: {
        transform(doc, ret) {
            delete ret._id;
            delete ret.__v;
        },

        virtuals: true,
    },
};

const schema = new mongoose.Schema(schemaObject, options);

// NOTE: Arrow functions are not supported in Mongoose model
schema.virtual("shortname").get(function () {
    const lastname = this.lastname.length > 3 ? this.lastname.slice(0, 3) : this.lastname;
    return `${this.firstname.slice(0, 1)}.${lastname}`.toUpperCase();
});

schema.virtual("fullname").get(function () {
    return `${this.firstname} ${this.lastname}`;
});

schema.virtual("data.age").get(function () {
    return calculateAge(this.birthday);
});

schema.statics.get = get;
schema.statics.getById = getById;
schema.statics.add = add;
schema.statics.updateById = updateById;
schema.statics.deleteById = deleteById;

export const Players = new mongoose.model("players", schema);
