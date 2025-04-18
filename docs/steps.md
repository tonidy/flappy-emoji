# Flappy Bird Clone - Step-by-Step Plan

1.  **Project Setup & Dependencies:**

    - Ensure you have a React project set up.
    - Install necessary libraries: `framer-motion`.
      ```bash
      bun install framer-motion
      ```

2.  **Component Structure:**

    - Create components: `Game.tsx`, `Bird.tsx`, `Pipe.tsx`, `ScoreDisplay.tsx`, `StartScreen.tsx`, `GameOverScreen.tsx` (likely within `src/components/`).
    - Render the `Game` component within your main page/route (e.g., in `src/page/Home.tsx`).

3.  **Game Area & Styling:**

    - Define the main game container in `Game.tsx`.
    - Style it using CSS (dimensions, `overflow: hidden`, `position: relative`, background).

4.  **Bird Component (`Bird.tsx`):**

    - Use `framer-motion`'s `motion.div`.
    - Manage vertical position (`y`) via state in `Game.tsx`.
    - Animate `y` position and potentially rotation.

5.  **Physics - Gravity & Jump (`Game.tsx`):**

    - Implement a game loop (`requestAnimationFrame`).
    - Apply gravity (increase downward velocity).
    - Handle jump (apply upward velocity on user input).

6.  **Pipe Component (`Pipe.tsx`):**

    - Represent top and bottom pipes.
    - Accept props for positioning (e.g., `topHeight`, `gapSize`).
    - Use `motion.div` for horizontal animation.

7.  **Pipe Generation & Movement (`Game.tsx`):**

    - Maintain an array of pipe data in state (`{ id, x, topHeight }`).
    - In the game loop:
      - Move existing pipes left (`update x`).
      - Periodically add new pipes off-screen right (random `topHeight`).
      - Remove pipes that move off-screen left.
    - Render `Pipe` components based on the state array.

8.  **Collision Detection (`Game.tsx`):**

    - In the game loop, check for collisions:
      - Bird vs. Ground/Ceiling.
      - Bird vs. Pipes (using `getBoundingClientRect()`).
    - Set game state to 'gameOver' on collision.

9.  **Scoring (`Game.tsx` & `ScoreDisplay.tsx`):**

    - Maintain `score` state in `Game.tsx`.
    - Increment score when a bird passes a pipe.
    - Pass `score` to `ScoreDisplay.tsx`.

10. **Game State Management (`Game.tsx`):**

    - Use state for `'idle'`, `'playing'`, `'gameOver'`.
    - Conditionally render UI elements (`StartScreen`, `GameOverScreen`, game elements) based on state.
    - Control the game loop based on state.
    - Implement start and restart logic.

11. **Refinements:**
    - Add sound effects.
    - Use `framer-motion` for screen transitions.
    - Optimize with `React.memo` if needed.
