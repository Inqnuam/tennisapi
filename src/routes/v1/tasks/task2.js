import { findId } from "../../../middlewares/findId.js";
import { getPlayerById } from "../../../controllers/tasks/task2.js";
import { Router } from "express";

const route = Router();

route.get("/:id?", findId, getPlayerById);

export default route;
