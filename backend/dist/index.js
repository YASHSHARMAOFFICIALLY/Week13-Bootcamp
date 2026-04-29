import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.routes.js";
import submitRouter from "./modules/submit/submit.route.js";
import { globalLimiter } from "./lib/rateLimiter.js";
const app = express();
const PORT = process.env.PORT ?? 3000;
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);
app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Server is running" });
});
app.use("/auth", authRouter);
app.use("/submit", submitRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
