import express from "express";
import { askChampAI } from "../services/openai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: "Messages array is required"
    });
  }

  try {
    const result = await askChampAI(messages);

    res.json({
      response: result.text
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

export default router;