import { useState, useEffect, useRef } from "react";

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

export const useGame = (targetPhrase: string) => {
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

    const newKeyMap: Record<string, string> = {};
    AZERTY_LAYOUT.forEach((key, index) => {
      newKeyMap[key] = newShuffledKeys[index];
    });
    setKeyMap(newKeyMap);
  }, []);

  const handleKeyPress = (key: string) => {
    if (isComplete) return;

    if (!hasStarted) {
      setHasStarted(true);
      setIsKeyboardVisible(false);
      setIsRunning(true);
      setCurrentPhrase(key.toUpperCase());
    } else {
      const newPhrase =
        key === "Backspace"
          ? currentPhrase.slice(0, -1)
          : key === " "
          ? currentPhrase + " "
          : currentPhrase + key;

      setCurrentPhrase(newPhrase);

      if (newPhrase.toLowerCase() === targetPhrase.toLowerCase()) {
        setIsComplete(true);
        setIsRunning(false);
      }
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    setIsKeyboardVisible(false);
    setIsRunning(true);
    setTime(0);
  };

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

      const newKeyMap: Record<string, string> = {};
      AZERTY_LAYOUT.forEach((key, index) => {
        newKeyMap[key] = initialShuffledKeys[index];
      });
      setKeyMap(newKeyMap);

      setTime((prev) => prev + 10);
      setTimeout(() => {
        setIsKeyboardVisible(false);
        setShowPlusTen(false);
      }, 10000);
    }
  };

  const handleRestart = () => {
    setCurrentPhrase("");
    setTime(0);
    setIsComplete(false);
    setHasStarted(false);
    setIsKeyboardVisible(true);
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

  return {
    currentPhrase,
    isKeyboardVisible,
    time,
    isRunning,
    shuffledKeys,
    hasStarted,
    keyMap,
    showCursor,
    showPlusTen,
    timerPosition,
    isComplete,
    timerRef,
    handleKeyPress,
    handleStart,
    handleShowKeyboard,
    handleRestart,
  };
};
