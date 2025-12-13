import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("dirname:", __dirname);

dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
});

dotenv.config({
  path: path.resolve(__dirname, "../../../packages/db/.env"),
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import v1Routes from "./routes/v1/index.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/v1", v1Routes);

app.listen(PORT, () => {
  console.log(`HTTP server running at port ${PORT}`);
});
