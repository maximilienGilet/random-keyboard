import React, { useState, useEffect, useRef, useCallback } from "react";
import VirtualKeyboard from "./components/VirtualKeyboard";
import PlusTenAnimation from "./components/PlusTenAnimation";
import Leaderboard, { Score } from "./components/Leaderboard";

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
    "The quick brown fox jumps over the lazy dog"
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
  const [showConfetti, setShowConfetti] = useState(true);
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
      }
      setIsKeyboardVisible(true);
      setShuffledKeys(initialShuffledKeys);
      setShowPlusTen(true);

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
      }, 10000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
      setShowConfetti(false); // Stop confetti after saving score
    }
  };

  const handleRestart = () => {
    setCurrentPhrase("");
    setTime(0);
    setIsComplete(false);
    setShowConfetti(false);
    setHasStarted(false);
    setIsKeyboardVisible(true);
    setPlayerName("");
    setShowNameInput(false);
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8 font-serif">
      <div className="max-w-6xl mx-auto flex gap-8 relative z-10">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-center mb-8 text-amber-900">
            Random Keyboard Challenge
          </h1>

          <div className="bg-amber-50 p-6 border-4 border-amber-800 mb-6 shadow-lg">
            <div className="mb-4">
              <p className="text-xl mb-2 text-amber-900 font-bold">
                Target Phrase:
              </p>
              <div className="text-xl tracking-wider bg-amber-50 p-4 border-2 border-amber-700">
                {targetPhrase}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xl mb-2 text-amber-900 font-bold">
                Current Phrase:
              </p>
              <div className="text-xl tracking-wider bg-amber-50 p-4 border-2 border-amber-700">
                {currentPhrase}
                <span
                  className={`inline-block w-2 h-6 bg-amber-900 align-middle ${
                    showCursor ? "opacity-100" : "opacity-0"
                  }`}
                ></span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xl mb-2 text-amber-900 font-bold">Time:</p>
              <div
                ref={timerRef}
                className="text-5xl font-bold text-amber-900 bg-amber-50 p-6 text-center border-4 border-amber-800"
              >
                <span className="tracking-wider">{formatTime(time)}</span>
              </div>
            </div>

            {!hasStarted ? (
              <button
                onClick={handleStart}
                className="w-full mb-4 px-6 py-3 bg-amber-800 text-amber-50 border-2 border-amber-900 hover:bg-amber-900 transition-colors font-bold"
              >
                Start Challenge
              </button>
            ) : !isComplete ? (
              <button
                onClick={handleShowKeyboard}
                className={`w-full mb-4 px-6 py-3 border-2 transition-colors font-bold ${
                  isKeyboardVisible
                    ? "bg-amber-200 text-amber-600 cursor-not-allowed border-amber-400"
                    : "bg-amber-800 text-amber-50 hover:bg-amber-900 border-amber-900"
                }`}
                disabled={isKeyboardVisible}
              >
                Show Keyboard (+10s penalty)
              </button>
            ) : null}

            {isComplete && !showNameInput && (
              <button
                onClick={handleRestart}
                className="w-full mt-4 px-6 py-3 bg-amber-800 text-amber-50 border-2 border-amber-900 hover:bg-amber-900 transition-colors font-bold"
              >
                Start New Challenge
              </button>
            )}
          </div>

          <VirtualKeyboard
            onKeyPress={handleKeyPress}
            isVisible={isKeyboardVisible}
            shuffledKeys={shuffledKeys}
            hasStarted={hasStarted}
          />
        </div>

        <div className="w-80">
          <Leaderboard scores={scores} />
        </div>
      </div>

      {showNameInput && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content">
            <h2
              id="modal-title"
              className="text-2xl font-bold text-amber-900 mb-4"
            >
              Save Your Score
            </h2>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="playerName"
                  className="block text-amber-900 font-bold mb-2"
                  id="name-label"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-2 border-2 border-amber-700 rounded bg-amber-50"
                  placeholder="Enter your name"
                  required
                  aria-required="true"
                  aria-labelledby="name-label"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowNameInput(false)}
                  className="px-4 py-2 border-2 border-amber-700 text-amber-900 hover:bg-amber-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 text-amber-50 border-2 border-amber-900 hover:bg-amber-900 transition-colors"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
