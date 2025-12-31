import { Router } from "express";
import {
  fetchUser,
  loginUser,
  signupUser,
} from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", signupUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", verifyJWT, fetchUser);

export { authRouter };
