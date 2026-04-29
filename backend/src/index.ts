import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.routes.js";
import progressRouter from "./modules/progress/progress.route.js";
import submitRouter from "./modules/submit/submit.route.js";
import { globalLimiter } from "./lib/rateLimiter.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_ORIGIN ?? "http://localhost:3001",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.use("/auth", authRouter);
app.use("/submit", submitRouter);
app.use("/progress", progressRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
