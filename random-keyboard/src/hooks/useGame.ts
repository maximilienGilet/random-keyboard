import { useState, useEffect, useRef } from "react";
import { AZERTY_LAYOUT } from "../const/keyboard";
import { KONAMI_CODE } from "../const/game";
import { useTimer } from "./useTimer";

export const useGame = (targetPhrase: string, onComplete?: () => void) => {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [shuffledKeys, setShuffledKeys] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [keyMap, setKeyMap] = useState<Record<string, string>>({});
  const [initialShuffledKeys, setInitialShuffledKeys] = useState<string[]>([]);
  const [showPlusTen, setShowPlusTen] = useState(false);
  const [timerPosition, setTimerPosition] = useState({ x: 0, y: 0 });
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const { time, reset: resetTimer, addTime } = useTimer(isRunning);

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

  // Keyboard event handler
  useEffect(() => {
    if (isComplete) return;

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

        // Check for completion
        if (newPhrase.toLowerCase() === targetPhrase.toLowerCase()) {
          setIsComplete(true);
          setIsRunning(false);
          setTimeout(() => {
            onComplete?.();
          }, 100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    currentPhrase,
    hasStarted,
    keyMap,
    konamiSequence,
    isComplete,
    targetPhrase,
    onComplete,
  ]);

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
        setTimeout(() => {
          onComplete?.();
        }, 100);
      }
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    setIsKeyboardVisible(false);
    setIsRunning(true);
    resetTimer();
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

      addTime(10);
      setTimeout(() => {
        setIsKeyboardVisible(false);
        setShowPlusTen(false);
      }, 10000);
    }
  };

  const handleRestart = () => {
    setCurrentPhrase("");
    resetTimer();
    setShuffledKeys(shuffleKeys());
    setIsComplete(false);
    setHasStarted(false);
    setIsKeyboardVisible(true);
  };

  return {
    currentPhrase,
    isKeyboardVisible,
    time,
    isRunning,
    shuffledKeys,
    hasStarted,
    keyMap,
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
