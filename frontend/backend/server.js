import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import chatRouter from './routes/chat.js';
import ttsRouter from './routes/tts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);
app.use('/api/tts', ttsRouter);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Portfolio Backend is running'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});