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

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const audioPath = 'c:/Users/champ/Desktop/ALL PROJECTS/PORTFOLIO/WhatsApp Audio 2026-07-02 at 12.24.50 PM.mp3';

async function cloneVoice() {
  console.log('--- ElevenLabs Voice Cloning Script ---');

  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY.includes('your_elevenlabs_api_key_here')) {
    console.error('\x1b[31mError: ELEVENLABS_API_KEY is not set in backend/.env.\x1b[0m');
    console.log('Please open \x1b[36mbackend/.env\x1b[0m and add your API key:');
    console.log('ELEVENLABS_API_KEY=your_key_here\n');
    process.exit(1);
  }

  if (!fs.existsSync(audioPath)) {
    console.error(`\x1b[31mError: Audio file not found at: ${audioPath}\x1b[0m`);
    process.exit(1);
  }

  console.log(`Reading audio file from ${audioPath}...`);
  const audioBuffer = fs.readFileSync(audioPath);
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });

  console.log('Uploading sample to ElevenLabs for Instant Voice Cloning...');
  
  const formData = new FormData();
  formData.append('name', 'Champa Jha (WhatsApp Clone)');
  formData.append('description', 'Voice clone of Champa Jha from WhatsApp audio file');
  formData.append('files', audioBlob, 'voice_sample.mp3');

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const voiceId = data.voice_id;

    if (!voiceId) {
      throw new Error('No voice_id returned from ElevenLabs API');
    }

    console.log(`\n\x1b[32mSuccess! Voice cloned successfully.\x1b[0m`);
    console.log(`Voice ID: \x1b[36m${voiceId}\x1b[0m`);

    // Update .env file
    console.log(`Updating ${envPath}...`);
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('ELEVENLABS_VOICE_ID=')) {
      envContent = envContent.replace(/ELEVENLABS_VOICE_ID=.*/, `ELEVENLABS_VOICE_ID=${voiceId}`);
    } else {
      envContent += `\nELEVENLABS_VOICE_ID=${voiceId}\n`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log('\x1b[32m.env file updated successfully!\x1b[0m');

  } catch (err) {
    console.error('\n\x1b[31mVoice cloning failed:\x1b[0m');
    console.error(err.message);
    process.exit(1);
  }
}

cloneVoice();
