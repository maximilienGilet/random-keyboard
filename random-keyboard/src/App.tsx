import React, { useState, useEffect } from "react";
import VirtualKeyboard from "./components/VirtualKeyboard";
import PlusTenAnimation from "./components/PlusTenAnimation";

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
  const timerRef = React.useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      // Handle backspace
      if (event.key === "Backspace") {
        setCurrentPhrase((prev) => prev.slice(0, -1));
        return;
      }

      // Handle space
      if (event.key === " ") {
        setCurrentPhrase((prev) => prev + " ");
        return;
      }

      // Start the game on first key press if not started
      if (!hasStarted && keyMap[key]) {
        handleStart();
        setCurrentPhrase(keyMap[key]);
        return;
      }

      // Continue the game if already started
      if (hasStarted && keyMap[key]) {
        setCurrentPhrase((prev) => prev + keyMap[key]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [hasStarted, keyMap]);

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

  const handleKeyPress = (key: string) => {
    if (hasStarted) {
      setCurrentPhrase((prev) => prev + key);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Random Keyboard Challenge
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="mb-4">
            <p className="text-xl mb-2">Target Phrase:</p>
            <div className="font-mono text-xl tracking-wider bg-gray-50 p-2 rounded">
              {targetPhrase}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xl mb-2">Current Phrase:</p>
            <div className="font-mono text-xl tracking-wider bg-gray-50 p-2 rounded">
              {currentPhrase}
              <span
                className={`inline-block w-2 h-6 bg-gray-800 align-middle ${
                  showCursor ? "opacity-100" : "opacity-0"
                }`}
              ></span>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xl mb-2">Time:</p>
            <div
              ref={timerRef}
              className="font-mono text-5xl font-bold text-blue-600 bg-gray-50 p-6 rounded-lg text-center shadow-inner border-2 border-blue-100"
            >
              <span className="tracking-wider">{formatTime(time)}</span>
            </div>
          </div>

          {!hasStarted ? (
            <button
              onClick={handleStart}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors w-full mb-4"
            >
              Start Challenge
            </button>
          ) : (
            <button
              onClick={handleShowKeyboard}
              className={`px-6 py-3 rounded-lg w-full mb-4 transition-colors ${
                isKeyboardVisible
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={isKeyboardVisible}
            >
              Show Keyboard (+10s penalty)
            </button>
          )}
        </div>

        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          isVisible={isKeyboardVisible}
          shuffledKeys={shuffledKeys}
          hasStarted={hasStarted}
        />

        <PlusTenAnimation
          isVisible={showPlusTen}
          startPosition={timerPosition}
        />
      </div>
    </div>
  );
};

export default App;
