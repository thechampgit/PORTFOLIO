import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRouter from "../backend/routes/chat.js";
import ttsRouter from "../backend/routes/tts.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRouter);
app.use("/api/tts", ttsRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Portfolio Backend is running"
  });
});

export default app;