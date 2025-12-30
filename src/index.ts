import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import express from "express";
import { authRouter } from "./routes/user.route";

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to SimuInterview!",
  });
});

app.use("/api/auth", authRouter);

app.listen(process.env.PORT ?? 5000, () => {
  console.log(
    `The server is running on http://localhost:${process.env.PORT ?? 5000}`
  );
});
