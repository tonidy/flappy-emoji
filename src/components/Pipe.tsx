import React from "react";
import { motion } from "framer-motion";

// Define constants for pipe styling and dimensions
const PIPE_WIDTH = 60;
const PIPE_COLOR = "green";

interface PipeProps {
  topHeight: number;
  gap: number;
  x: number;
  gameHeight: number; // Add gameHeight prop
}

const Pipe: React.FC<PipeProps> = ({ topHeight, gap, x, gameHeight }) => {
  // Calculate bottom pipe height based on gameHeight prop
  const bottomHeight = gameHeight - topHeight - gap;

  return (
    // Use motion.div for the container to enable animation later
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: PIPE_WIDTH,
        left: x, // x position will be animated later
      }}
      // Initial animation state can be set here if needed, e.g., initial={{ x: initialX }}
      // Animate prop will be controlled by the Game component later
    >
      {/* Top Pipe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: topHeight,
          backgroundColor: PIPE_COLOR,
        }}
      />
      {/* Bottom Pipe */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: bottomHeight,
          backgroundColor: PIPE_COLOR,
        }}
      />
    </motion.div>
  );
};

export default Pipe;
