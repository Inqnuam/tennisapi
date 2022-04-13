import { authorize } from "../../../../middlewares/auth.js";
import { findId } from "../../../../middlewares/findId.js";
import { updatePlayerController } from "../../../../controllers/players/update.js";
import { Router } from "express";

const route = Router();

route.patch("/:id?", authorize(), findId, updatePlayerController);

export default route;
