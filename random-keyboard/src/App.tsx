import React, { useState, useEffect } from "react";
import VirtualKeyboard from "./components/VirtualKeyboard";

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

  const shuffleKeys = () => {
    const keys = "abcdefghijklmnopqrstuvwxyz".split("");
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    return keys;
  };

  useEffect(() => {
    const newShuffledKeys = shuffleKeys();
    setShuffledKeys(newShuffledKeys);

    // Create mapping between physical and virtual keys
    const newKeyMap: Record<string, string> = {};
    const physicalKeys = "abcdefghijklmnopqrstuvwxyz".split("");
    physicalKeys.forEach((key, index) => {
      newKeyMap[key] = newShuffledKeys[index];
    });
    setKeyMap(newKeyMap);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!hasStarted) return;

      const key = event.key.toLowerCase();
      if (keyMap[key]) {
        setCurrentPhrase((prev) => prev + keyMap[key]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [hasStarted, keyMap]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setHasStarted(true);
    setIsKeyboardVisible(false);
    setIsRunning(true);
    setTime(0);
  };

  const handleShowKeyboard = () => {
    if (hasStarted) {
      setIsKeyboardVisible(true);
      const newShuffledKeys = shuffleKeys();
      setShuffledKeys(newShuffledKeys);

      // Update key mapping
      const newKeyMap: Record<string, string> = {};
      const physicalKeys = "abcdefghijklmnopqrstuvwxyz".split("");
      physicalKeys.forEach((key, index) => {
        newKeyMap[key] = newShuffledKeys[index];
      });
      setKeyMap(newKeyMap);

      setTime((prev) => prev + 10); // 10 seconds penalty
      setTimeout(() => {
        setIsKeyboardVisible(false);
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
          <p className="text-xl mb-4">
            Target Phrase: <span className="font-mono">{targetPhrase}</span>
          </p>
          <p className="text-xl mb-4">
            Current Phrase: <span className="font-mono">{currentPhrase}</span>
          </p>
          <p className="text-xl mb-4">
            Time: <span className="font-mono">{formatTime(time)}</span>
          </p>

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
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors w-full mb-4"
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
        />
      </div>
    </div>
  );
};

export default App;
