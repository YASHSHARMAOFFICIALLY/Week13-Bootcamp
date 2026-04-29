import { Router } from "express";
import { submit } from "./submit.controller.js";

const submitRouter = Router();

submitRouter.post("/", submit);

export default submitRouter;
