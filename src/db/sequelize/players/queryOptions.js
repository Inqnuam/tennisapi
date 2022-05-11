import { Countries } from "../countries/index.js";
import { Data } from "../data/index.js";
import { Games } from "../games/index.js";

export default {
    include: [
        {
            model: Countries,
            attributes: ["code", "picture"],
        },
        {
            model: Data,
            as: "data",
            attributes: { exclude: ["id", "PlayerId"] },
            include: {
                model: Games,
                as: "games",
                attributes: {
                    exclude: ["datumId", "id"],
                },
            },
        },
    ],
    attributes: {
        exclude: ["countryCode", "dataId"],
    },
    order: [
        [
            {
                model: Data,
                as: "data",
            },
            "points",
            "DESC",
        ],
    ],
};
