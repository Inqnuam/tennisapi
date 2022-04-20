import players from "./players/index.js";
import player from "./player/index.js";
import { Router } from "express";

const route = Router();

route.get("/key/:key?", (req, res) => {
    res.json({ validKey: req.params.key === process.env.API_KEY });
});
route.use("/players", players);
route.use("/player", player);
export default route;
