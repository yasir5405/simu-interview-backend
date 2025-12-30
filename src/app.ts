import express from "express";
import { authRouter } from "./routes/user.route";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to SimuInterview!",
  });
});

app.use("/api/auth", authRouter);

export default app;
