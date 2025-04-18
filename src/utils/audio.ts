// --- Preload Audio ---
// Verify these paths point correctly to files inside your public/sounds/ directory
export const flapSound = typeof Audio !== "undefined" ? new Audio("/sounds/flap.wav") : null;
export const scoreSound = typeof Audio !== "undefined" ? new Audio("/sounds/score.wav") : null;
export const hitSound = typeof Audio !== "undefined" ? new Audio("/sounds/hit.wav") : null;

// Helper function to play sound (handles potential errors and resets playback)
export const playSound = (sound: HTMLAudioElement | null) => {
  if (sound) {
    sound.currentTime = 0; // Rewind to start in case it's already playing
    sound.play().catch((error) => console.error("Error playing sound:", error));
  }
};
