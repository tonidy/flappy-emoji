import React from "react";

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "2rem",
        color: "white",
        zIndex: 10,
      }}
    >
      {score}
    </div>
  );
};

export default ScoreDisplay;
