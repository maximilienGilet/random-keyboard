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
        setCurrentPhrase(keyMap[key].toUpperCase());
        return;
      }

      // Continue the game if already started
      if (hasStarted && keyMap[key]) {
        setCurrentPhrase((prev) => {
          if (prev.length === 0) {
            return keyMap[key].toUpperCase();
          }
          return prev + keyMap[key];
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [hasStarted, keyMap, konamiSequence]);

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
    <div className="min-h-screen bg-amber-50 p-8 font-serif">
      <div className="max-w-4xl mx-auto">
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
          ) : (
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
