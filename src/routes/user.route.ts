import { Router } from "express";
import { loginUser, signupUser } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signupUser);
authRouter.post("/login", loginUser);

export { authRouter };
