import { Router } from "express";
import { authLimiter } from "../../lib/rateLimiter.js";
import { register, signin } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", authLimiter, register);
authRouter.post("/signin", authLimiter, signin);

export default authRouter;
