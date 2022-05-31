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
            include: {
                model: Games,
                as: "games",
            },
        },
    ],
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
