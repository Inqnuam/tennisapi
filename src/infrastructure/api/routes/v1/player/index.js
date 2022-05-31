import { Router } from "express";
import { authorize } from "../../../middlewares/auth.js";
import { findId } from "../../../middlewares/findId.js";
import { addPlayerController } from "../../../controllers/players/add.js";
import { deletePlayerController } from "../../../controllers/players/delete.js";
import { updatePlayerController } from "../../../controllers/players/update.js";
import { getPlayerByIdController } from "../../../controllers/players/getById.js";

const player = Router();

player.get("/:id?", findId, getPlayerByIdController);
player.post("/", authorize(), addPlayerController);
player.patch("/:id?", authorize(), findId, updatePlayerController);
player.delete("/:id?", authorize(), findId, deletePlayerController);

export default player;
