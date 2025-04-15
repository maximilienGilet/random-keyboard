import React, { useState, useEffect } from "react";
import PlusTenAnimation from "./components/PlusTenAnimation";
import Leaderboard, { Score } from "./components/Leaderboard";
import GameDisplay from "./components/GameDisplay";
import ScoreModal from "./components/ScoreModal";
import { TARGET_PHRASE } from "./const/game";
import { useGame } from "./hooks/useGame";

const App: React.FC = () => {
  const [playerName, setPlayerName] = useState("");
  const [scores, setScores] = useState<Score[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);

  const {
    currentPhrase,
    isKeyboardVisible,
    time,
    shuffledKeys,
    hasStarted,
    showCursor,
    showPlusTen,
    timerPosition,
    isComplete,
    timerRef,
    handleKeyPress,
    handleStart,
    handleShowKeyboard,
    handleRestart,
  } = useGame(TARGET_PHRASE, () => {
    setShowNameInput(true);
  });

  useEffect(() => {
    // Load scores from localStorage
    const savedScores = localStorage.getItem("keyboardScores");
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      const newScore: Score = {
        name: playerName.trim(),
        time: time * 1000, // Convert to milliseconds
        date: new Date().toISOString(),
      };

      const updatedScores = [...scores, newScore]
        .sort((a, b) => a.time - b.time)
        .slice(0, 10); // Keep only top 10 scores

      setScores(updatedScores);
      localStorage.setItem("keyboardScores", JSON.stringify(updatedScores));
      setShowNameInput(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8 font-serif">
      <div className="max-w-6xl mx-auto flex gap-8 relative z-10">
        <GameDisplay
          targetPhrase={TARGET_PHRASE}
          currentPhrase={currentPhrase}
          showCursor={showCursor}
          time={time}
          timerRef={timerRef}
          isKeyboardVisible={isKeyboardVisible}
          shuffledKeys={shuffledKeys}
          hasStarted={hasStarted}
          showPlusTen={showPlusTen}
          timerPosition={timerPosition}
          handleKeyPress={handleKeyPress}
          handleStart={handleStart}
          handleShowKeyboard={handleShowKeyboard}
          handleRestart={handleRestart}
          isComplete={isComplete}
        />

        <div className="w-80">
          <Leaderboard scores={scores} />
        </div>
      </div>

      <ScoreModal
        time={time}
        scores={scores}
        playerName={playerName}
        setPlayerName={setPlayerName}
        showNameInput={showNameInput}
        setShowNameInput={setShowNameInput}
        handleNameSubmit={handleNameSubmit}
        handleRestart={handleRestart}
      />

      {showPlusTen && (
        <PlusTenAnimation
          isVisible={showPlusTen}
          startPosition={timerPosition}
        />
      )}
    </div>
  );
};

export default App;
