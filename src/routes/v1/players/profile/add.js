import { Router } from "express";
import { authorize } from "../../../../middlewares/auth.js";
import { addPlayerController } from "../../../../controllers/players/add.js";

const route = Router();

route.post("/", authorize(), addPlayerController);

export default route;
