import React, { useEffect, useState } from "react";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  isVisible: boolean;
  shuffledKeys: string[];
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
}) => {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    setKeys(shuffledKeys);
  }, [shuffledKeys]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 rounded-t-lg">
      <div className="max-w-4xl mx-auto">
        {/* First row */}
        <div className="flex justify-center mb-1">
          {keys.slice(0, 10).map((key, index) => (
            <button
              key={index}
              className="flex-1 max-w-[40px] bg-gray-700 text-white p-2 m-1 rounded hover:bg-gray-600 transition-colors"
              onClick={() => onKeyPress(key)}
            >
              <div className="text-xs text-gray-400">
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
              className="flex-1 max-w-[40px] bg-gray-700 text-white p-2 m-1 rounded hover:bg-gray-600 transition-colors"
              onClick={() => onKeyPress(key)}
            >
              <div className="text-xs text-gray-400">
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
              className="flex-1 max-w-[40px] bg-gray-700 text-white p-2 m-1 rounded hover:bg-gray-600 transition-colors"
              onClick={() => onKeyPress(key)}
            >
              <div className="text-xs text-gray-400">
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
