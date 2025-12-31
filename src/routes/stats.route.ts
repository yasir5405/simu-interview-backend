import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getStats } from "../controllers/stats.controller";

const statsRouter = Router();

statsRouter.get("/", verifyJWT, getStats);

export { statsRouter };
