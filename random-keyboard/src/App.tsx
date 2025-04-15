import React, { useState, useEffect, useRef } from "react";
import PlusTenAnimation from "./components/PlusTenAnimation";
import Leaderboard, { Score } from "./components/Leaderboard";
import GameDisplay from "./components/GameDisplay";
import ScoreModal from "./components/ScoreModal";

// AZERTY keyboard layout (first row)
const AZERTY_LAYOUT = [
  "a",
  "z",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "q",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "w",
  "x",
  "c",
  "v",
  "b",
  "n",
];

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const App: React.FC = () => {
  const [targetPhrase] = useState(
    "Portez ce vieux whisky au juge blond qui fume"
  );
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [shuffledKeys, setShuffledKeys] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [keyMap, setKeyMap] = useState<Record<string, string>>({});
  const [initialShuffledKeys, setInitialShuffledKeys] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [showPlusTen, setShowPlusTen] = useState(false);
  const [timerPosition, setTimerPosition] = useState({ x: 0, y: 0 });
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [scores, setScores] = useState<Score[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);

  // Blink cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const shuffleKeys = () => {
    const keys = [...AZERTY_LAYOUT];
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    return keys;
  };

  useEffect(() => {
    const newShuffledKeys = shuffleKeys();
    setShuffledKeys(newShuffledKeys);
    setInitialShuffledKeys(newShuffledKeys);

    // Create mapping between physical AZERTY keys and virtual keys
    const newKeyMap: Record<string, string> = {};
    AZERTY_LAYOUT.forEach((key, index) => {
      newKeyMap[key] = newShuffledKeys[index];
    });
    setKeyMap(newKeyMap);
  }, []);

  const handleKeyPress = (key: string) => {
    if (isComplete) return; // Don't accept input if game is complete

    if (!hasStarted) {
      setHasStarted(true);
      setIsKeyboardVisible(false);
      setIsRunning(true);
      setCurrentPhrase(key.toUpperCase());
    } else {
      // Calculate what the new phrase would be
      const newPhrase =
        key === "Backspace"
          ? currentPhrase.slice(0, -1)
          : key === " "
          ? currentPhrase + " "
          : currentPhrase + key;

      // Update the phrase first
      setCurrentPhrase(newPhrase);

      // Then check for completion
      if (newPhrase.toLowerCase() === targetPhrase.toLowerCase()) {
        setIsComplete(true);
        setIsRunning(false);
        // Add a small delay before showing the modal
        setTimeout(() => {
          setShowNameInput(true);
        }, 100);
      }
    }
  };

  useEffect(() => {
    if (isComplete) {
      // Remove all game-related event listeners
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      // Check for Konami code
      const newSequence = [...konamiSequence, event.key];
      setKonamiSequence(newSequence.slice(-KONAMI_CODE.length));

      if (newSequence.join(",") === KONAMI_CODE.join(",")) {
        // Revert to standard AZERTY mapping
        const standardKeyMap: Record<string, string> = {};
        AZERTY_LAYOUT.forEach((key, index) => {
          standardKeyMap[key] = key;
        });
        setKeyMap(standardKeyMap);
        setShuffledKeys(AZERTY_LAYOUT);
        setInitialShuffledKeys(AZERTY_LAYOUT);
        setKonamiSequence([]);
        return;
      }

      // Check if this key press would complete the game
      const newPhrase =
        event.key === "Backspace"
          ? currentPhrase.slice(0, -1)
          : event.key === " "
          ? currentPhrase + " "
          : currentPhrase + keyMap[key];

      if (newPhrase.toLowerCase() === targetPhrase.toLowerCase()) {
        setIsComplete(true);
        setIsRunning(false);
        setCurrentPhrase(newPhrase);
        // Add a delay before showing the form
        setTimeout(() => {
          setShowNameInput(true);
        }, 100);
        return;
      }

      // Handle backspace
      if (event.key === "Backspace") {
        setCurrentPhrase(currentPhrase.slice(0, -1));
        return;
      }

      // Handle space
      if (event.key === " ") {
        setCurrentPhrase(currentPhrase + " ");
        return;
      }

      // Start the game on first key press if not started
      if (!hasStarted && keyMap[key]) {
        handleStart();
        setCurrentPhrase(keyMap[key].toUpperCase());
        return;
      }

      // Continue the game if already started
      if (hasStarted && keyMap[key]) {
        const newPhrase =
          currentPhrase.length === 0
            ? keyMap[key].toUpperCase()
            : currentPhrase + keyMap[key];
        setCurrentPhrase(newPhrase);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    hasStarted,
    keyMap,
    konamiSequence,
    currentPhrase,
    targetPhrase,
    isComplete,
  ]);

  const handleStart = () => {
    setHasStarted(true);
    setIsKeyboardVisible(false);
    setIsRunning(true);
    setTime(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleShowKeyboard = () => {
    if (hasStarted) {
      if (timerRef.current) {
        const rect = timerRef.current.getBoundingClientRect();
        setTimerPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
        console.log("Timer Position:", {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
      setIsKeyboardVisible(true);
      setShuffledKeys(initialShuffledKeys);
      setShowPlusTen(true);
      console.log("Show Plus Ten:", true);

      // Reuse the initial key mapping
      const newKeyMap: Record<string, string> = {};
      AZERTY_LAYOUT.forEach((key, index) => {
        newKeyMap[key] = initialShuffledKeys[index];
      });
      setKeyMap(newKeyMap);

      setTime((prev) => prev + 10); // 10 seconds penalty
      setTimeout(() => {
        setIsKeyboardVisible(false);
        setShowPlusTen(false);
        console.log("Show Plus Ten:", false);
      }, 10000);
    }
  };

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

  const handleRestart = () => {
    setCurrentPhrase("");
    setTime(0);
    setIsComplete(false);
    setHasStarted(false);
    setIsKeyboardVisible(true);
    setPlayerName("");
    setShowNameInput(false);
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8 font-serif">
      <div className="max-w-6xl mx-auto flex gap-8 relative z-10">
        <GameDisplay
          targetPhrase={targetPhrase}
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
