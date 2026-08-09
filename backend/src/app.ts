import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";

import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { healthRouter } from "./routes/health.routes.js";

export const app: Express = express();

// An explicit allowlist, because a wildcard origin cannot be combined with
// credentialed requests — and every auth call sends the refresh cookie.
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

// Both must stay last: anything mounted after them would never be reached, and
// the error handler only sees failures from middleware registered before it.
app.use(notFoundHandler);
app.use(errorHandler);
