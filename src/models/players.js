import mongoose from "mongoose";
import { calculateAge } from "../helpers/calculateAge.js";

const schema = new mongoose.Schema(
    {
        id: {
            type: Number,
            default: Date.now,
            immutable: true,
        },
        firstname: {
            type: String,
            trim: true,
            minlength: 2,
            required: [checkIfRequired, "Le prénom est obligatoire"],
        },
        lastname: {
            type: String,
            trim: true,
            minlength: 2,
            required: [checkIfRequired, "Le nom de famille est obligatoire"],
        },
        birthday: {
            type: Number,
            required: [checkIfRequired, "La date de naissance du joueur est obligatoire"],
        },
        sex: {
            type: String,
            enum: ["M", "F"],
            required: [checkIfRequired, "Le sexe est obligatoire. Valeurs acceptées: 'F', 'M'"],
        },
        country: {
            picture: {
                type: String,
                required: [checkIfRequired, "Un lien vers l'image du drapeau du pays est obligatoire"],
            },
            code: {
                type: String,
                trim: true,
                minlength: 3,
                maxlength: 3,
                required: [checkIfRequired, "Le code du pays est obligatoire! Ex: RUS pour la Russie"],
            },
        },
        picture: {
            type: String,
            required: [checkIfRequired, "Un lien vers la photo du joueur est obligatoire"],
        },
        data: {
            rank: {
                type: Number,
                required: [checkIfRequired, "Le rang du joueur dans le classement est obligatoire"],
            },
            points: {
                type: Number,
                default: 0,
            },
            weight: {
                type: Number,
                min: [10000, "Vous croyez vraiment qu'un joueur ATP/WTP pese 10kg?"],
                required: [checkIfRequired, "Le poids (en gramme) du joueur est obligatoire"],
            },
            height: {
                type: Number,
                min: [20, "Vous croyez vraiment qu'un joueur ATP/WTP mesure 20cm?"],
                required: [checkIfRequired, "La taille (en cm) du joueur est obligatoire"],
            },
            last: {
                type: [Number],
                default: [],
            },
        },
    },
    {
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
    }
);

// NOTE: arrow functions are not supported in schema.virtual getter/setter callback
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

function checkIfRequired() {
    return this.isNew ? true : false;
}

export const Players = mongoose.model("players", schema);
