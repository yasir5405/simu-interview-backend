import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import app from "./app";

const PORT = process.env.PORT ?? 5000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
