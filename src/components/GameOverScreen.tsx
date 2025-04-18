import React from "react";
import { Button } from "@/components/ui/button"; // If using shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // If using shadcn/ui

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
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
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 20,
      }}
    >
      {/* Use shadcn/ui Card */}
      <Card className="w-[350px]">
        {" "}
        {/* Added a default width, adjust as needed */}
        <CardHeader>
          <CardTitle className="text-center">Game Over!</CardTitle> {/* Centered title */}
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Your Score: {score}</p>
          <Button onClick={onRestart}>Restart</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOverScreen;
