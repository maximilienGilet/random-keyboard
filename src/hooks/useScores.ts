import { useState, useEffect } from "react";
import { Score } from "../components/Leaderboard";

export const useScores = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    const savedScores = localStorage.getItem("keyboardScores");
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent, time: number) => {
    e.preventDefault();
    if (playerName.trim()) {
      const newScore: Score = {
        name: playerName.trim(),
        time: time * 1000,
        date: new Date().toISOString(),
      };

      const updatedScores = [...scores, newScore]
        .sort((a, b) => a.time - b.time)
        .slice(0, 10);

      setScores(updatedScores);
      localStorage.setItem("keyboardScores", JSON.stringify(updatedScores));
      setShowNameInput(false);
    }
  };

  return {
    scores,
    playerName,
    setPlayerName,
    showNameInput,
    setShowNameInput,
    handleNameSubmit,
  };
};
