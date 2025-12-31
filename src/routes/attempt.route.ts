import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { postAttempt } from "../controllers/attempt.controller";

const attemptRouter = Router();

attemptRouter.post("/", verifyJWT, postAttempt);
attemptRouter.get("/me", verifyJWT);

export { attemptRouter };
