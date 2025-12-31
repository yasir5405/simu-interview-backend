import { Router } from "express";
import { requireAdmin, verifyJWT } from "../middlewares/auth.middleware";
import {
  getQuestion,
  getQuestions,
  postQuestion,
} from "../controllers/question.controller";

const questionRouter = Router();

questionRouter.post("/", verifyJWT, requireAdmin, postQuestion);
questionRouter.get("/", verifyJWT, getQuestions);
questionRouter.get("/:id", verifyJWT, getQuestion);

export { questionRouter };
