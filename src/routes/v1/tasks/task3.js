import { doTask3 } from "../../../controllers/tasks/task3.js";
import { Router } from "express";

const route = Router();

route.get("/", doTask3);

export default route;
