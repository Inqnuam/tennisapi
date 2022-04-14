import players from "./players/index.js";
import tasks from "./tasks/index.js";
import { Router } from "express";

const route = Router();

route.get("/key/:key?", (req, res) => {
    res.json({ validKey: req.params.key === process.env.API_KEY });
});
route.use("/players", players);
route.use("/tasks", tasks);

export default route;
