import express from "express";
import { authRouter } from "./routes/user.route";
import { topicRouter } from "./routes/topic.route";
import { questionRouter } from "./routes/question.route";
import { attemptRouter } from "./routes/attempt.route";
import { statsRouter } from "./routes/stats.route";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to SimuInterview!",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/topics", topicRouter);
app.use("/api/questions", questionRouter);
app.use("/api/attempts", attemptRouter);
app.use("/api/stats", statsRouter);

export default app;
