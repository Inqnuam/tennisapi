import mongoose from "mongoose";
import { calculateAge } from "../../../helpers/calculateAge.js";
import { schema } from "./schema.js";
import { updateById } from "./statics/updateById.js";
import { add } from "./statics/add.js";
import { deleteById } from "./statics/deleteById.js";
import { get } from "./statics/get.js";
import { getById } from "./statics/getById.js";

const model = new mongoose.model(schema, {
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
});

// NOTE: Arrow functions are not supported in Mongoose model
model.virtual("shortname").get(function () {
    const lastname = this.lastname.length > 3 ? this.lastname.slice(0, 3) : this.lastname;
    return `${this.firstname.slice(0, 1)}.${lastname}`.toUpperCase();
});

model.virtual("fullname").get(function () {
    return `${this.firstname} ${this.lastname}`;
});

model.virtual("data.age").get(function () {
    return calculateAge(this.birthday);
});

model.statics.get = get;
model.statics.getById = getById;
model.statics.add = add;
model.statics.updateById = updateById;
model.statics.deleteById = deleteById;

export const Players = mongoose.model("players", model);
