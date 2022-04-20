import mongoose from "mongoose";
import { calculateAge } from "../../helpers/calculateAge.js";
import ServerError from "../../helpers/serverError.js";

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

// NOTE: Arrow functions are not supported in Mongoose Schema
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

schema.statics.get = async function get() {
    return await this.find({}).sort({ "data.points": -1 });
};

schema.statics.getById = async function getById(id) {
    const foundPlayer = await this.findOne({ id: id }, null, { strictQuery: true });
    if (foundPlayer) {
        return foundPlayer;
    } else {
        throw new ServerError(404, "Player not found", "Joueur introuvable");
    }
};

schema.statics.add = async function add(player) {
    const foundPlayer = await this.findOne({ id: player.id }, null, { strictQuery: true });
    if (foundPlayer) {
        throw new ServerError(409, "A player with the same id exists", ":(");
    }

    return await this.create(player);
};

schema.statics.updateById = async function updateById(id, body) {
    const foundPlayer = await this.findOne({ id: id }, null, { strictQuery: true });
    if (!foundPlayer) {
        throw new ServerError(404, "Incorrect id", "Joueur introuvable");
    }

    let updatingData = body;

    if (body.country) {
        Object.keys(body.country).forEach((e) => {
            updatingData[`country.${e}`] = body.country[e];
        });

        delete updatingData.country;
    }

    if (body.data) {
        Object.keys(body.data).forEach((e) => {
            updatingData[`data.${e}`] = body.data[e];
        });

        delete updatingData.data;
    }

    foundPlayer.set(updatingData);
    const updatedPlayer = await foundPlayer.save();

    return updatedPlayer;
};

schema.statics.deleteById = async function deleteById(id) {
    const deletedPlayer = await this.findOneAndDelete({ id: id }, { strictQuery: true });
    if (deletedPlayer) {
        return deletedPlayer.id;
    }

    throw new ServerError(404, "Unknown player", "Joueur introuvable");
};

export const Players = mongoose.model("players", schema);
