import OpenAI from 'openai/index.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client
let openai;
const initOpenAI = () => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      openai = new OpenAI({ apiKey });
    }
  }
  return openai;
};

// Cache system prompt and portfolio data in memory
let cachedSystemPrompt = '';
const getSystemPrompt = () => {
  if (!cachedSystemPrompt) {
    const promptPath = path.join(__dirname, '../prompts/systemPrompt.txt');
    const dataPath = path.join(__dirname, '../data/portfolioData.json');
    
    const promptText = fs.readFileSync(promptPath, 'utf8');
    const portfolioData = fs.readFileSync(dataPath, 'utf8');
    
    cachedSystemPrompt = `${promptText}\n\nPORTFOLIO DATA:\n${portfolioData}`;
  }
  return cachedSystemPrompt;
};

export async function askChampAI(messages) {
  const client = initOpenAI();
  
  if (!client) {
    throw new Error('OPENAI_API_KEY is not configured on the backend');
  }

  const systemPrompt = getSystemPrompt();

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.4
  });

  const replyText = response.choices[0].message.content.trim();

  return { text: replyText };
}
