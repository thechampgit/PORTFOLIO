import express from "express";
import { generateTTS } from "../services/tts.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({
      error: "Text is required"
    });
  }

  try {
    const { audioBuffer, mimeType } = await generateTTS(text);

    res.setHeader("Content-Type", mimeType);
    res.send(audioBuffer);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

export default router;