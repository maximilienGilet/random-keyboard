import React, { useEffect, useState } from "react";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  isVisible: boolean;
  shuffledKeys: string[];
  hasStarted?: boolean;
}

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

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  isVisible,
  shuffledKeys,
  hasStarted,
}) => {
  const [keys, setKeys] = useState<string[]>([]);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setKeys(shuffledKeys);
  }, [shuffledKeys]);

  useEffect(() => {
    if (isVisible && hasStarted) {
      setProgress(100);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 0.1; // Decrease by 0.1% every 10ms for smoother animation
        });
      }, 10);
      return () => clearInterval(interval);
    }
  }, [isVisible, hasStarted]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black p-4 border-t border-green-600">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        {hasStarted && (
          <div className="h-1 bg-black mb-4 overflow-hidden border border-green-800">
            <div
              className="h-full bg-green-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* First row */}
        <div className="flex justify-center mb-1">
          {keys.slice(0, 10).map((key, index) => (
            <button
              key={index}
              className="flex-1 max-w-[40px] bg-black text-green-400 p-2 m-1 border border-green-800 hover:bg-green-900 transition-colors"
              onClick={() => onKeyPress(key)}
            >
              <div className="text-xs text-green-600">
                {AZERTY_LAYOUT[index]}
              </div>
              <div className="text-lg">{key}</div>
            </button>
          ))}
        </div>
        {/* Second row */}
        <div className="flex justify-center mb-1">
          {keys.slice(10, 20).map((key, index) => (
            <button
              key={index + 10}
              className="flex-1 max-w-[40px] bg-black text-green-400 p-2 m-1 border border-green-800 hover:bg-green-900 transition-colors"
              onClick={() => onKeyPress(key)}
            >
              <div className="text-xs text-green-600">
                {AZERTY_LAYOUT[index + 10]}
              </div>
              <div className="text-lg">{key}</div>
            </button>
          ))}
        </div>
        {/* Third row */}
        <div className="flex justify-center">
          {keys.slice(20).map((key, index) => (
            <button
              key={index + 20}
              className="flex-1 max-w-[40px] bg-black text-green-400 p-2 m-1 border border-green-800 hover:bg-green-900 transition-colors"
              onClick={() => onKeyPress(key)}
            >
              <div className="text-xs text-green-600">
                {AZERTY_LAYOUT[index + 20]}
              </div>
              <div className="text-lg">{key}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
