import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import v1Routes from "./routes/v1/index.js";

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log(process.env.FRONTEND_URL);
app.use("/api/v1", v1Routes);

app.listen(PORT, () => {
  console.log(`HTTP server running at port ${PORT}`);
});
