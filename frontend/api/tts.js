import { generateTTS } from "../backend/services/tts.js";

export default async function handler(req, res) {

  const text =
    req.method === "GET"
      ? req.query.text
      : req.body.text;

  if (!text) {
    return res.status(400).json({
      error: "Text is required",
    });
  }

  try {

    const { audioBuffer, mimeType } =
      await generateTTS(text);

    res.setHeader("Content-Type", mimeType);

    res.send(audioBuffer);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });

  }

}