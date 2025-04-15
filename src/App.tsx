import React from "react";
import PlusTenAnimation from "./components/PlusTenAnimation";
import Leaderboard from "./components/Leaderboard";
import GameDisplay from "./components/GameDisplay";
import ScoreModal from "./components/ScoreModal";
import { TARGET_PHRASE } from "./const/game";
import { useGame } from "./hooks/useGame";
import { useScores } from "./hooks/useScores";

const App: React.FC = () => {
  const {
    currentPhrase,
    isKeyboardVisible,
    time,
    shuffledKeys,
    hasStarted,
    showPlusTen,
    timerPosition,
    isComplete,
    timerRef,
    handleStart,
    handleShowKeyboard,
    handleRestart,
  } = useGame(TARGET_PHRASE, () => {
    setShowNameInput(true);
  });

  const {
    playerName,
    setPlayerName,
    scores,
    showNameInput,
    setShowNameInput,
    handleNameSubmit,
  } = useScores();

  return (
    <div className="min-h-screen bg-amber-50 p-8 font-serif">
      <div className="max-w-6xl mx-auto flex gap-8 relative z-10">
        <GameDisplay
          targetPhrase={TARGET_PHRASE}
          currentPhrase={currentPhrase}
          time={time}
          timerRef={timerRef}
          isKeyboardVisible={isKeyboardVisible}
          shuffledKeys={shuffledKeys}
          hasStarted={hasStarted}
          showPlusTen={showPlusTen}
          timerPosition={timerPosition}
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
        handleNameSubmit={(e) => handleNameSubmit(e, time)}
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
