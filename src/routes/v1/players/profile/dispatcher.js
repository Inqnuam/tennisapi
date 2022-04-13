import addplayer from "./add.js";
import deletePlayer from "./delete.js";
import updatePlayer from "./update.js";
import { Router } from "express";

const profile = Router();

profile.use("/", addplayer, updatePlayer, deletePlayer);

export default profile;
