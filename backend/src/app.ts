import cors from "cors";
import express, { type Express } from "express";

import { healthRouter } from "./routes/health.routes.js";

export const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
