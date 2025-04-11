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
    <div className="min-h-screen bg-black text-green-500 p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-400">
          Random Keyboard Challenge
        </h1>

        <div className="bg-black p-6 border border-green-600 mb-6">
          <div className="mb-4">
            <p className="text-xl mb-2 text-green-400">{">"} Target Phrase:</p>
            <div className="text-xl tracking-wider bg-black p-2 border border-green-800">
              {targetPhrase}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xl mb-2 text-green-400">{">"} Current Phrase:</p>
            <div className="text-xl tracking-wider bg-black p-2 border border-green-800">
              {currentPhrase}
              <span
                className={`inline-block w-2 h-6 bg-green-500 align-middle ${
                  showCursor ? "opacity-100" : "opacity-0"
                }`}
              ></span>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xl mb-2 text-green-400">{">"} Time:</p>
            <div
              ref={timerRef}
              className="text-5xl font-bold text-green-400 bg-black p-6 text-center border border-green-600"
            >
              <span className="tracking-wider">{formatTime(time)}</span>
            </div>
          </div>

          {!hasStarted ? (
            <button
              onClick={handleStart}
              className="w-full mb-4 px-6 py-3 bg-black text-green-400 border border-green-700 hover:bg-green-900 transition-colors"
            >
              {">"} Start Challenge
            </button>
          ) : (
            <button
              onClick={handleShowKeyboard}
              className={`w-full mb-4 px-6 py-3 border transition-colors ${
                isKeyboardVisible
                  ? "bg-black text-gray-500 cursor-not-allowed border-gray-700"
                  : "bg-black text-green-400 hover:bg-green-900 border-green-700"
              }`}
              disabled={isKeyboardVisible}
            >
              {">"} Show Keyboard (+10s penalty)
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
