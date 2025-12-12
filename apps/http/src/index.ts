import express from "express";
import dotenv from "dotenv";
import v1Routes from "./routes/v1/index.js";
import cors from "cors";
dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

app.use("/api/v1", v1Routes);

app.listen(PORT, () => {
  console.log(`HTTP server running at port ${PORT}`);
});
