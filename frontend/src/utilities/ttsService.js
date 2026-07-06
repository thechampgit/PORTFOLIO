// A clean service layer for Text-To-Speech (TTS) using voice-cloning services
// This module isolates the speaking logic from the UI and main chatbot components,
// and interacts with the backend voice cloning API using the HTML5 Audio API.

let activeAudio = null;
let activeAudioUrl = null;
let currentPlaybackState = "stopped"; // playing | paused | stopped | loading
let activeOnStart = null;
let activeOnEnd = null;
let activeOnError = null;

// Clean markdown and unnecessary formatting
function cleanTextForSpeech(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#+\s+([^\n]+)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/- \*\*[^*]+\*\*:\s+/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function speakText(
  text,
  onStart = null,
  onEnd = null,
  onError = null
) {
  stopSpeaking();

  activeOnStart = onStart;
  activeOnEnd = onEnd;
  activeOnError = onError;

  // Clean and limit the text length
  const cleanedText = cleanTextForSpeech(text).slice(0, 350);

  if (!cleanedText) {
    activeOnEnd?.();
    return;
  }

  try {
    currentPlaybackState = "loading";
    activeOnStart?.("loading");

    const backendUrl = `/api/tts?text=${encodeURIComponent(cleanedText)}`;

    activeAudio = new Audio(backendUrl);

    activeAudio.onplay = () => {
      currentPlaybackState = "playing";
      activeOnStart?.("playing");
    };

    activeAudio.onpause = () => {
      currentPlaybackState = "paused";
      activeOnStart?.("paused");
    };

    activeAudio.onended = () => {
      cleanupActiveAudio();
      activeOnEnd?.();
    };

    activeAudio.onerror = async () => {
      console.error("Audio playback failed.");
      cleanupActiveAudio();
      activeOnError?.(new Error("Audio playback failed."));
    };

    await activeAudio.play();
  } catch (err) {
    console.error("Voice generation failed:", err);
    cleanupActiveAudio();
    activeOnError?.(err);
  }
}

export function pauseSpeaking() {
  if (activeAudio && currentPlaybackState === "playing") {
    activeAudio.pause();
  }
}

export function resumeSpeaking() {
  if (activeAudio && currentPlaybackState === "paused") {
    activeAudio.play().catch((err) => {
      console.error("Failed to resume playback:", err);
      cleanupActiveAudio();
      activeOnError?.(err);
    });
  }
}

export function stopSpeaking() {
  cleanupActiveAudio();
}

function cleanupActiveAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = "";
    activeAudio.load();
    activeAudio = null;
  }

  if (activeAudioUrl) {
    URL.revokeObjectURL(activeAudioUrl);
    activeAudioUrl = null;
  }

  currentPlaybackState = "stopped";
  activeOnStart = null;
  activeOnEnd = null;
  activeOnError = null;
}

export function getPlaybackState() {
  return currentPlaybackState;
}