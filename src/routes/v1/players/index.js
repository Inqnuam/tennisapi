import profile from "./profile/dispatcher.js";
import { Router } from "express";

const players = Router();

players.use("/profile", profile);

export default players;
