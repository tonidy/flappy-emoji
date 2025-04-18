import React from "react";
// import { Button } from "@/components/ui/button"; // If using shadcn/ui

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 20,
      }}
    >
      <button onClick={onStart}>Start Game</button>
      {/* Or use shadcn Button: <Button onClick={onStart}>Start Game</Button> */}
    </div>
  );
};

export default StartScreen;
