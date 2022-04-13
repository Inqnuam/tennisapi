import task1 from "./task1.js";
import task2 from "./task2.js";
import task3 from "./task3.js";
import { Router } from "express";

const route = Router();

route.use("/task1", task1);
route.use("/task2", task2);
route.use("/task3", task3);

export default route;
