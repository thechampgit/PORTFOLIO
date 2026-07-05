// A clean service layer for Text-To-Speech (TTS) using voice-cloning services
// This module isolates the speaking logic from the UI and main chatbot components,
// and interacts with the backend voice cloning API using the HTML5 Audio API.

let activeAudio = null;
let activeAudioUrl = null;
let currentPlaybackState = 'stopped'; // 'playing', 'paused', 'stopped', 'loading'
let activeOnStart = null;
let activeOnEnd = null;
let activeOnError = null;

// Utility to clean markdown out of text so the voice synthesis reads it naturally
function cleanTextForSpeech(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // remove bold asterisks
    .replace(/\*([^*]+)\*/g, '$1')     // remove italic asterisks
    .replace(/#+\s+([^\n]+)/g, '$1')   // remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove markdown links, keep only text
    .replace(/`([^`]+)`/g, '$1')       // remove code backticks
    .replace(/- \*\*[^*]+\*\*:\s+/g, '') // clean lists with bold items
    .replace(/\n+/g, ' ');             // replace newlines with space
}

/**
 * Speaks the provided text by fetching synthesized audio from the backend voice cloning API.
 * 
 * @param {string} text Text to synthesize.
 * @param {Function} onStart Callback invoked when audio starts playing (passes 'playing' or 'loading').
 * @param {Function} onEnd Callback invoked when audio playback finishes.
 * @param {Function} onError Callback invoked if synthesis or playback fails.
 */
export async function speakText(text, onStart = null, onEnd = null, onError = null) {
  // 1. Cancel any active speech first
  stopSpeaking();
  
  activeOnStart = onStart;
  activeOnEnd = onEnd;
  activeOnError = onError;

  const cleanedText = cleanTextForSpeech(text);

  if (!cleanedText.trim()) {
    if (activeOnEnd) activeOnEnd();
    return;
  }

  try {
    currentPlaybackState = 'loading';
    if (activeOnStart) activeOnStart('loading');

    // 2. Play the audio directly from the backend streaming GET endpoint
    const backendUrl = `/api/tts?text=${encodeURIComponent(cleanedText)}`;
    activeAudio = new Audio(backendUrl);

    activeAudio.onplay = () => {
      currentPlaybackState = 'playing';
      if (activeOnStart) activeOnStart('playing');
    };

    activeAudio.onpause = () => {
      currentPlaybackState = 'paused';
      if (activeOnStart) activeOnStart('paused');
    };

    activeAudio.onended = () => {
      cleanupActiveAudio();
      if (activeOnEnd) activeOnEnd();
    };

    activeAudio.onerror = (e) => {
      cleanupActiveAudio();
      if (activeOnError) activeOnError(e);
    };

    await activeAudio.play();

  } catch (err) {
    cleanupActiveAudio();
    console.error("Voice generation failed:", err);
    if (activeOnError) activeOnError(err);
  }
}

/**
 * Pauses the active audio playback.
 */
export function pauseSpeaking() {
  if (activeAudio && currentPlaybackState === 'playing') {
    activeAudio.pause();
  }
}

/**
 * Resumes the paused audio playback.
 */
export function resumeSpeaking() {
  if (activeAudio && currentPlaybackState === 'paused') {
    activeAudio.play().catch(err => {
      console.error("Failed to resume playback:", err);
      cleanupActiveAudio();
      if (activeOnError) activeOnError(err);
    });
  }
}

/**
 * Stops any ongoing audio playback immediately and frees system resources.
 */
export function stopSpeaking() {
  cleanupActiveAudio();
}

/**
 * Helper to release audio elements and revoke created object URLs.
 */
function cleanupActiveAudio() {
  if (activeAudio) {
    try {
      activeAudio.pause();
    } catch (e) {}
    activeAudio = null;
  }
  if (activeAudioUrl) {
    URL.revokeObjectURL(activeAudioUrl);
    activeAudioUrl = null;
  }
  currentPlaybackState = 'stopped';
  activeOnStart = null;
  activeOnEnd = null;
  activeOnError = null;
}

/**
 * Gets the current playback state ('playing', 'paused', 'stopped', 'loading')
 */
export function getPlaybackState() {
  return currentPlaybackState;
}
