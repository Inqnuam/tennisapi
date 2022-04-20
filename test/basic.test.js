import { getSum, calculateIMC, getMedianOf, getBestCountry, getPlayersAverageIMC } from "../src/controllers/players/helpers.js";
import assert from "assert";

import { players } from "../resources/headtohead.js";

const SERBIA = {
    code: "SRB",
    picture: "https://data.latelier.co/training/tennis_stats/resources/Serbie.png",
    ratio: 5,
};
describe("Testing basic functions", () => {
    it("Get sum from an array of numbers", () => {
        assert.equal(getSum([1, 2, 7]), 10);
        assert.equal(getSum([50, 9, 0]), 59);
        assert.equal(getSum([1, 1, -1]), 1);
    });

    it("Find median of an array of numbers", () => {
        assert.equal(getMedianOf([1, 2, 3, 4, 5]), 3);
        assert.equal(getMedianOf([1, 2, 3, 4, 4]), 3);
        assert.equal(getMedianOf([5, 2, 4, 3, 1]), 3);
        assert.equal(getMedianOf([5, 2, 4, 3, 1, -6]), 2.5);
    });

    it("Calculate human IMC", () => {
        assert.equal(calculateIMC(72000, 175), 23.510204081632654);
        assert.equal(calculateIMC(0, 0), 0);
        assert.equal(calculateIMC("a", "b"), 0);
    });

    it("Calculate players average IMC", () => {
        assert.equal(getPlayersAverageIMC(players), 23.36);
    });

    it("Find best country from an array of tennis players", () => {
        assert.deepEqual(getBestCountry(players), SERBIA);
    });
});
