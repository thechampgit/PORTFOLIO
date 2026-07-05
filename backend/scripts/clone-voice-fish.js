import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const FISHAUDIO_API_KEY = process.env.FISHAUDIO_API_KEY || process.env.FISH_API_KEY;
const audioPath = 'c:/Users/champ/Desktop/ALL PROJECTS/PORTFOLIO/WhatsApp Audio 2026-07-02 at 12.24.50 PM.mp3';

async function cloneVoiceFish() {
  console.log('--- Fish Audio Voice Cloning Script ---');

  if (!FISHAUDIO_API_KEY) {
    console.error('\x1b[31mError: FISHAUDIO_API_KEY is not set in backend/.env.\x1b[0m');
    console.log('Please open \x1b[36mbackend/.env\x1b[0m and add your Fish Audio API key:');
    console.log('FISHAUDIO_API_KEY=your_key_here\n');
    console.log('You can get a free API key at https://fish.audio/');
    process.exit(1);
  }

  if (!fs.existsSync(audioPath)) {
    console.error(`\x1b[31mError: Audio file not found at: ${audioPath}\x1b[0m`);
    process.exit(1);
  }

  console.log(`Reading audio file from ${audioPath}...`);
  const audioBuffer = fs.readFileSync(audioPath);
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });

  console.log('Uploading sample to Fish Audio to create a voice clone model...');
  
  const formData = new FormData();
  formData.append('type', 'tts');
  formData.append('title', 'Champa Jha (WhatsApp Fish)');
  formData.append('train_mode', 'fast');
  formData.append('visibility', 'private');
  formData.append('voices', audioBlob, 'voice_sample.mp3');

  try {
    const response = await fetch('https://api.fish.audio/model', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FISHAUDIO_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fish Audio API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const voiceId = data._id || data.id;

    if (!voiceId) {
      throw new Error(`No voice ID (_id) returned from Fish Audio API. Response: ${JSON.stringify(data)}`);
    }

    console.log(`\n\x1b[32mSuccess! Voice cloned successfully.\x1b[0m`);
    console.log(`Fish Audio Voice ID: \x1b[36m${voiceId}\x1b[0m`);

    // Update .env file
    console.log(`Updating ${envPath}...`);
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('FISHAUDIO_VOICE_ID=')) {
      envContent = envContent.replace(/FISHAUDIO_VOICE_ID=.*/, `FISHAUDIO_VOICE_ID=${voiceId}`);
    } else {
      envContent += `\nFISHAUDIO_VOICE_ID=${voiceId}\n`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log('\x1b[32m.env file updated successfully!\x1b[0m');

  } catch (err) {
    console.error('\n\x1b[31mFish Audio voice cloning failed:\x1b[0m');
    console.error(err.message);
    process.exit(1);
  }
}

cloneVoiceFish();
