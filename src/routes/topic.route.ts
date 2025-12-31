import { Router } from "express";
import { requireAdmin, verifyJWT } from "../middlewares/auth.middleware";
import { getTopics, postTopics } from "../controllers/topic.controller";

const topicRouter = Router();

topicRouter.post("/", verifyJWT, requireAdmin, postTopics);
topicRouter.get("/", verifyJWT, getTopics);

export { topicRouter };
