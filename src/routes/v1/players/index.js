import { Router } from "express";
import { getPlayersController } from "../../../controllers/players/get.js";
import { getPlayersStatsController } from "../../../controllers/players/stats.js";

const players = Router();

players.get("/", getPlayersController);
players.get("/stats", getPlayersStatsController);

export default players;
