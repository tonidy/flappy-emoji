// --- Preload Audio ---
const base = import.meta.env.BASE_URL;
export const flapSound = typeof Audio !== "undefined" ? new Audio(`${base}sounds/flap.wav`) : null;
export const scoreSound =
  typeof Audio !== "undefined" ? new Audio(`${base}sounds/score.wav`) : null;
export const hitSound = typeof Audio !== "undefined" ? new Audio(`${base}sounds/hit.wav`) : null;

// Helper function to play sound (handles potential errors and resets playback)
export const playSound = (sound: HTMLAudioElement | null) => {
  if (sound) {
    sound.currentTime = 0; // Rewind to start in case it's already playing
    sound.play().catch((error) => console.error("Error playing sound:", error));
  }
};
