import React, { useEffect, useState } from "react";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  isVisible: boolean;
  shuffledKeys: string[];
}

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
        <div className="grid grid-cols-10 gap-1">
          {keys.map((key, index) => (
            <button
              key={index}
              className="bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition-colors"
              onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
