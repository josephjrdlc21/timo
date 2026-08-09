import { Router, type Router as ExpressRouter } from "express";

import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema } from "../schemas/auth.schema.js";

/** Mounted at /api/auth — the router itself stays prefix-agnostic. */
export const authRouter: ExpressRouter = Router();

authRouter.post("/login", validateBody(loginSchema), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", requireAuth, authController.me);
