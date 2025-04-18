import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import constants, types, and utils
import {
  GAME_HEIGHT,
  BIRD_SIZE,
  BIRD_START_X,
  GRAVITY,
  JUMP_HEIGHT,
  GROUND_HEIGHT,
  PIPE_WIDTH,
  PIPE_GAP,
  PIPE_SPEED,
  PIPE_INTERVAL,
  GAME_WIDTH,
} from "../config/constants";
import { GameState, PipeState } from "../types/game";
import { flapSound, scoreSound, hitSound } from "../utils/audio";
// Import components
import Bird from "./Bird";
import Pipe from "./Pipe";
import ScoreDisplay from "./ScoreDisplay";
import GameOverScreen from "./GameOverScreen";

const Game = () => {
  // State initializations using imported constants
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
  const [velocityY, setVelocityY] = useState(0);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [pipes, setPipes] = useState<PipeState[]>([]);
  const [score, setScore] = useState(0);
  const timeSinceLastPipe = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const nextPipeId = useRef<number>(0);

  // Game loop logic using imported constants
  const gameLoop = useCallback(
    (currentTime: number) => {
      // The check for gameState !== 'playing' is crucial here
      if (gameState !== "playing") {
        lastTimeRef.current = null;
        return;
      }

      // --- Initial frame setup ---
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime; // Set the time for the *next* frame calculation
        requestAnimationFrame(gameLoop); // Request the next frame
        return; // Skip calculations for this very first frame
      }

      // --- Calculate deltaTime and update lastTimeRef ---
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime; // Update ref for the *next* frame's calculation

      // --- Time normalization ---
      const timeFactor = deltaTime / (1000 / 60);

      // --- Logging ---
      // Keep the log to verify state changes later
      console.log(
        `Game Loop Tick - Delta: ${deltaTime.toFixed(2)}ms, TimeFactor: ${timeFactor.toFixed(2)}, BirdY: ${birdPosition.toFixed(2)}, VelocityY: ${velocityY.toFixed(2)}, Pipes: ${pipes.length}`,
      );

      // --- Bird Physics (reads birdPosition, velocityY from potentially stale closure) ---
      // Calculate changes based on potentially stale values
      let newVelocityY = velocityY + GRAVITY * timeFactor;
      let newBirdPosition = birdPosition + newVelocityY * timeFactor;

      // --- Collision Detection (uses calculated newBirdPosition) ---
      let collisionDetected = false;

      // 1. Ground Collision
      if (newBirdPosition > GROUND_HEIGHT) {
        newBirdPosition = GROUND_HEIGHT; // Clamp position
        newVelocityY = 0; // Reset velocity
        collisionDetected = true;
      }

      // 2. Ceiling Collision
      if (newBirdPosition < 0) {
        newBirdPosition = 0; // Clamp position
        newVelocityY = 0; // Reset velocity
        collisionDetected = true;
      }

      // 3. Pipe Collision & Scoring Check (reads pipes, uses calculated newBirdPosition)
      const birdLeft = BIRD_START_X; // Use imported BIRD_START_X
      const birdRight = BIRD_START_X + BIRD_SIZE; // Use imported constants
      const birdTop = newBirdPosition;
      const birdBottom = newBirdPosition + BIRD_SIZE;

      // Change 'let' to 'const' as 'updatedPipes' is never reassigned
      const updatedPipes = [...pipes]; // Create a mutable copy for this frame

      for (let i = 0; i < updatedPipes.length; i++) {
        const pipe = updatedPipes[i];
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;
        const pipeTopHeight = pipe.topHeight;
        const pipeBottomY = pipe.topHeight + PIPE_GAP;

        // Check for collision
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          if (birdTop < pipeTopHeight || birdBottom > pipeBottomY) {
            collisionDetected = true;
            // No need to break here if we still want to check for scoring below
          }
        }

        // Check for passing pipe (score point)
        // In the pipe scoring check
        if (!pipe.passed && pipeRight < birdLeft) {
          updatedPipes[i] = { ...pipe, passed: true };
          setScore((prevScore) => prevScore + 1);
          if (!collisionDetected) {
            playSoundIfEnabled(scoreSound);
          }
        }

        // In collision handling
        if (collisionDetected) {
          console.log("Collision Detected!");
          playSoundIfEnabled(hitSound);
          setGameState("gameOver");
        } else {
          // --- Pipe Logic (only if no collision) ---
          // Fix: Use functional update for pipes to ensure we're using latest state
          setPipes((currentPipes) => {
            // Move existing pipes
            const movedPipes = currentPipes
              .map((pipe) => ({
                ...pipe,
                x: pipe.x - PIPE_SPEED * timeFactor,
              }))
              .filter((pipe) => pipe.x > -PIPE_WIDTH);

            return movedPipes;
          });

          // Generate new pipes
          timeSinceLastPipe.current += deltaTime;
          if (timeSinceLastPipe.current > PIPE_INTERVAL) {
            console.log("Generating New Pipe");
            timeSinceLastPipe.current = 0;
            const minTopHeight = 50;
            const maxTopHeight = GAME_HEIGHT - PIPE_GAP - 50;
            const topHeight =
              Math.floor(Math.random() * (maxTopHeight - minTopHeight + 1)) + minTopHeight;

            // Fix: Use functional update to ensure we're appending to latest pipe state
            setPipes((currentPipes) => [
              ...currentPipes,
              {
                id: nextPipeId.current++,
                x: GAME_WIDTH,
                topHeight: topHeight,
                passed: false,
              },
            ]);
          }
          requestAnimationFrame(gameLoop);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [birdPosition, gameState, pipes, velocityY],
  ); // Keep dependencies limited;

  // Effect to start/stop the game loop based on gameState
  useEffect(() => {
    let animationFrameId: number;
    if (gameState === "playing") {
      console.log("useEffect: Starting game loop"); // Add log
      lastTimeRef.current = null; // Reset time ref for the first frame
      timeSinceLastPipe.current = PIPE_INTERVAL; // Ensure first pipe doesn't generate immediately
      animationFrameId = requestAnimationFrame(gameLoop);
    } else {
      console.log(`useEffect: Game state is '${gameState}', loop should stop.`); // Add log
    }

    // Cleanup function to cancel the animation frame when the effect re-runs or component unmounts
    return () => {
      console.log("useEffect: Cleanup - Cancelling animation frame"); // Add log
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameLoop, gameState]); // Keep dependencies: effect runs if gameLoop OR gameState changes

  // Handle jump action / Start game
  const handleInteraction = () => {
    if (gameState === "idle") {
      setBirdPosition(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
      setVelocityY(0);
      setPipes([]);
      nextPipeId.current = 0;
      setScore(0); // Reset score when starting
      setGameState("idle");
      setVelocityY(-JUMP_HEIGHT); // Use imported JUMP_HEIGHT
      playSoundIfEnabled(flapSound);
    } else if (gameState === "playing") {
      setVelocityY(-JUMP_HEIGHT); // Use imported JUMP_HEIGHT
      playSoundIfEnabled(flapSound);
    }
  };

  // Handle restart
  const handleRestart = () => {
    // Reset state using imported constants
    setBirdPosition(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
    setVelocityY(0);
    setPipes([]);
    setScore(0);
    nextPipeId.current = 0;
    lastTimeRef.current = null;
    timeSinceLastPipe.current = 0;
    // Set state back to idle, ready for the first click/interaction to start
    setGameState("playing");
  };

  // Animation variants for fade in/out
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Add a new state for sound
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modify the playSound function to respect the sound setting
  const playSoundIfEnabled = (sound: HTMLAudioElement | null) => {
    if (soundEnabled && sound) {
      sound.currentTime = 0;
      sound.play().catch((error) => console.error("Error playing sound:", error));
    }
  };

  // Add a sound toggle handler
  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the game area click from triggering
    setSoundEnabled((prev) => !prev);
  };

  // Then in the JSX, add the sound toggle button
  return (
    <div
      onClick={handleInteraction}
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: "#71c5cf",
        overflow: "hidden",
        position: "relative",
        margin: "auto",
        border: "1px solid black",
        cursor: gameState === "playing" ? "pointer" : "default",
      }}
    >
      {/* Sound Toggle Button */}
      <div
        onClick={handleSoundToggle}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 30, // Ensure it's above other elements
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {soundEnabled ? "🔊" : "🔇"}
      </div>

      {/* Render Score Display only when playing */}
      {gameState === "playing" && <ScoreDisplay score={score} />}

      {/* Rest of the JSX remains the same */}
      {/* Render the Bird component */}
      <Bird y={birdPosition} size={BIRD_SIZE} x={BIRD_START_X} />

      {/* Render Pipes */}
      {pipes.map((pipe) => (
        <Pipe
          key={pipe.id}
          topHeight={pipe.topHeight}
          gap={PIPE_GAP}
          x={pipe.x}
          gameHeight={GAME_HEIGHT}
        />
      ))}

      {/* Use AnimatePresence to handle transitions */}
      <AnimatePresence>
        {/* Show prompt only when idle, with fade transition */}
        {gameState === "idle" && (
          <motion.div
            key="start-prompt" // Add a unique key for AnimatePresence
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.5 }} // Adjust duration as needed
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              fontSize: "1.5rem",
              zIndex: 10,
              pointerEvents: "none", // Prevent prompt from blocking clicks
            }}
          >
            Click to Start
          </motion.div>
        )}

        {/* Show Game Over screen, with fade transition */}
        {gameState === "gameOver" && (
          // Wrap GameOverScreen in motion.div for animation control
          <motion.div
            key="game-over" // Add a unique key for AnimatePresence
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.5 }} // Adjust duration as needed
            style={{
              position: "absolute", // Ensure it covers the area correctly
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 20, // Ensure it's above other elements
            }}
          >
            <GameOverScreen score={score} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game; // Now only exports the component
