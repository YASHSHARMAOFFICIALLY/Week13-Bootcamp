import { Router } from "express";
import { progress } from "./progress.controller.js";

const progressRouter = Router();

progressRouter.get("/", progress);

export default progressRouter;
