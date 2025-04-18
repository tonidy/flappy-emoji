// Define type for a pipe object
export interface PipeState {
  id: number;
  x: number;
  topHeight: number;
  passed: boolean; // Add flag to track if bird passed this pipe
}

// Define game states
export type GameState = "idle" | "playing" | "gameOver";
