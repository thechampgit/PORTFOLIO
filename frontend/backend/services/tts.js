import dotenv from 'dotenv';
dotenv.config();

/**
 * Generates speech audio buffer from text using Fish Audio, CosyVoice, or ElevenLabs fallback.
 * 
 * @param {string} text The clean text to synthesize.
 * @returns {Promise<{audioBuffer: Buffer, mimeType: string}>} The generated audio buffer and MIME type.
 */
export async function generateTTS(text) {
  const fishAudioApiKey = process.env.FISHAUDIO_API_KEY || process.env.FISH_API_KEY;
  const fishAudioVoiceId = process.env.FISHAUDIO_VOICE_ID;
const cosyVoiceUrl = process.env.COSYVOICE_URL;
  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
  const elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Default voice

  // 1. Try Fish Audio voice cloning API if key is configured
  if (fishAudioApiKey) {
    try {
      console.log('Attempting Fish Audio voice cloning...');
      const response = await fetch('https://api.fish.audio/v1/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${fishAudioApiKey}`,
          'model': 's2.1-pro-free'
        },
        body: JSON.stringify({
          text: text,
          reference_id: fishAudioVoiceId || undefined,
          format: 'mp3'
        }),
        signal: AbortSignal.timeout(30000)
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return {
          audioBuffer: Buffer.from(arrayBuffer),
          mimeType: 'audio/mpeg'
        };
      }
      console.warn(`Fish Audio responded with status: ${response.status}`);
    } catch (err) {
      console.warn('Fish Audio voice generation failed, checking fallbacks:', err.message);
    }
  }

  // 2. Try local CosyVoice server if URL is configured
  if (process.env.COSYVOICE_URL) {
    try {
      console.log(`Attempting CosyVoice voice cloning at ${cosyVoiceUrl}...`);
      // Node 18+ supports global fetch
      const response = await fetch(cosyVoiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          speaker: 'champa_clone' // Target speaker
        }),
        // Simple timeout wrapper via AbortSignal
        signal: AbortSignal.timeout(6000)
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return {
          audioBuffer: Buffer.from(arrayBuffer),
          mimeType: response.headers.get('content-type') || 'audio/wav'
        };
      }
      console.warn(`CosyVoice responded with status: ${response.status}`);
    } catch (err) {
      console.warn('CosyVoice service unavailable or timed out, checking fallbacks:', err.message);
    }
  }

  // 3. Try ElevenLabs voice cloning API fallback if key is configured
  if (elevenLabsApiKey) {
    try {
      console.log('Attempting ElevenLabs cloud voice cloning fallback...');
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return {
          audioBuffer: Buffer.from(arrayBuffer),
          mimeType: 'audio/mpeg'
        };
      }
      console.warn(`ElevenLabs fallback responded with status: ${response.status}`);
    } catch (err) {
      console.warn('ElevenLabs voice generation fallback failed:', err.message);
    }
  }

  throw new Error('TTS voice generation failed. All services (Fish Audio, CosyVoice, ElevenLabs) are offline or unconfigured.');
}

/**
 * Streams speech audio from Fish Audio, CosyVoice, or ElevenLabs fallback.
 * 
 * @param {string} text The clean text to synthesize.
 * @returns {Promise<{stream: ReadableStream, mimeType: string}>} The audio stream and MIME type.
 */
export async function streamTTS(text) {
  const fishAudioApiKey = process.env.FISHAUDIO_API_KEY || process.env.FISH_API_KEY;
  const fishAudioVoiceId = process.env.FISHAUDIO_VOICE_ID;
  const cosyVoiceUrl = process.env.COSYVOICE_URL || 'http://localhost:50000/tts';
  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
  const elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

  // 1. Try Fish Audio voice cloning API if key is configured
  if (fishAudioApiKey) {
    try {
      console.log('Attempting Fish Audio voice cloning stream...');
      const response = await fetch('https://api.fish.audio/v1/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${fishAudioApiKey}`,
          'model': 's2.1-pro-free'
        },
        body: JSON.stringify({
          text: text,
          reference_id: fishAudioVoiceId || undefined,
          format: 'mp3'
        }),
        signal: AbortSignal.timeout(30000)
      });

      if (response.ok && response.body) {
        return {
          stream: response.body,
          mimeType: 'audio/mpeg'
        };
      }
      console.warn(`Fish Audio stream responded with status: ${response.status}`);
    } catch (err) {
      console.warn('Fish Audio voice stream generation failed, checking fallbacks:', err.message);
    }
  }

  // 2. Try local CosyVoice server if URL is configured
  if (process.env.COSYVOICE_URL) {
    try {
      console.log(`Attempting CosyVoice voice cloning stream at ${cosyVoiceUrl}...`);
      const response = await fetch(cosyVoiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          speaker: 'champa_clone'
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok && response.body) {
        return {
          stream: response.body,
          mimeType: response.headers.get('content-type') || 'audio/wav'
        };
      }
      console.warn(`CosyVoice stream responded with status: ${response.status}`);
    } catch (err) {
      console.warn('CosyVoice stream service unavailable or timed out, checking fallbacks:', err.message);
    }
  }

  // 3. Try ElevenLabs voice cloning API fallback if key is configured
  if (elevenLabsApiKey) {
    try {
      console.log('Attempting ElevenLabs cloud voice cloning fallback stream...');
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok && response.body) {
        return {
          stream: response.body,
          mimeType: 'audio/mpeg'
        };
      }
      console.warn(`ElevenLabs stream fallback responded with status: ${response.status}`);
    } catch (err) {
      console.warn('ElevenLabs voice stream generation fallback failed:', err.message);
    }
  }

  throw new Error('TTS voice streaming failed. All services (Fish Audio, CosyVoice, ElevenLabs) are offline or unconfigured.');
}


