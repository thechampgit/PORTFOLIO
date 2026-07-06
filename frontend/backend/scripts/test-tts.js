import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateTTS } from '../services/tts.js';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testTTS() {
  console.log('Testing TTS service with Fish Audio clone...');
  try {
    const text = "Hi! I'm Champa Jha (also known as Rashi). Welcome to my portfolio! I'm here to chat about my background, projects, and experience. Feel free to ask me anything!";
    const { audioBuffer, mimeType } = await generateTTS(text);
    
    const outputPath = path.join(__dirname, 'test-output.mp3');
    fs.writeFileSync(outputPath, audioBuffer);
    
    console.log(`\n\x1b[32mSuccess! TTS generation completed.\x1b[0m`);
    console.log(`Output saved to: \x1b[36m${outputPath}\x1b[0m`);
    console.log(`MimeType: ${mimeType}`);
    console.log(`File Size: ${audioBuffer.length} bytes`);
  } catch (err) {
    console.error('\n\x1b[31mTTS test failed:\x1b[0m');
    console.error(err.message);
  }
}

testTTS();
