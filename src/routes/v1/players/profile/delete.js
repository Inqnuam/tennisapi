import { deletePlayerController } from "../../../../controllers/players/delete.js";
import { authorize } from "../../../../middlewares/auth.js";
import { findId } from "../../../../middlewares/findId.js";
import { Router } from "express";

const route = Router();

route.delete("/:id?", authorize(), findId, deletePlayerController);

export default route;
