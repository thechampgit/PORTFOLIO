import express from 'express';
import { generateTTS, streamTTS } from '../services/tts.js';
import { Readable } from 'stream';

const router = express.Router();

router.get('/', async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Text content is required for voice generation' });
  }

  try {
    const { stream, mimeType } = await streamTTS(text);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Transfer-Encoding', 'chunked');

    if (stream.pipe) {
      stream.pipe(res);
    } else {
      Readable.fromWeb(stream).pipe(res);
    }
  } catch (err) {
    console.error('Error generating streaming voice clone:', err.message);
    res.status(503).json({ error: 'Voice cloning service is currently unavailable' });
  }
});

router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text content is required for voice generation' });
  }

  try {
    const { audioBuffer, mimeType } = await generateTTS(text);
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    res.send(audioBuffer);
  } catch (err) {
    console.error('Error generating voice clone:', err.message);
    res.status(503).json({ error: 'Voice cloning service is currently unavailable' });
  }
});

export default router;

