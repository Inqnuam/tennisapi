import players from "./players/index.js";
import tasks from "./tasks/index.js";
import { Router } from "express";

const route = Router();

route.use("/players", players);
route.use("/tasks", tasks);

export default route;
