import React from "react";
import { motion } from "framer-motion";

// Define props for the Bird component
interface BirdProps {
  y: number;
  size: number;
  x: number;
}

const Bird: React.FC<BirdProps> = ({ y, size, x }) => {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        backgroundColor: "yellow", // Placeholder style
        borderRadius: "50%",
        position: "absolute",
        left: x, // Use x prop for horizontal position
        // top is now controlled by the animate prop below
      }}
      animate={{
        y: y, // Animate the y position based on the prop
      }}
      transition={{ type: "spring", stiffness: 50, damping: 15 }} // Add a subtle spring animation
    >
      🐦 {/* Or an image */}
    </motion.div>
  );
};

export default Bird;
