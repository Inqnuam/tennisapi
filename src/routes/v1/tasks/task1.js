import { Router } from "express";
import { getPlayersList } from "../../../controllers/tasks/task1.js";

const route = Router();

route.get("/", getPlayersList);

export default route;
