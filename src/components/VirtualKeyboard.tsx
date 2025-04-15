import React, { useEffect, useState } from "react";
import { AZERTY_LAYOUT } from "../const/keyboard";

interface VirtualKeyboardProps {
  isVisible: boolean;
  shuffledKeys: string[];
  hasStarted: boolean;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  isVisible,
  shuffledKeys,
  hasStarted,
}) => {
  const [progress, setProgress] = useState(100);

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
    <div className="bg-amber-50 p-4 border-4 border-amber-800 rounded-lg shadow-lg">
      <div className="flex flex-col gap-2">
        {/* Progress bar */}
        {hasStarted && (
          <div className="h-2 bg-amber-100 mb-4 overflow-hidden border-2 border-amber-700 rounded-lg">
            <div
              className="h-full bg-amber-800 transition-all duration-100 ease-linear rounded-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* First row */}
        <div className="flex justify-center gap-1">
          {shuffledKeys.slice(0, 10).map((key, index) => (
            <div
              key={index}
              className="flex-1 max-w-[40px] bg-amber-50 text-amber-900 p-2 m-1 border-2 border-amber-700 rounded-lg flex flex-col items-center justify-center"
            >
              <div className="text-xs text-amber-600">
                {AZERTY_LAYOUT[index]}
              </div>
              <div className="text-lg font-bold">{key}</div>
            </div>
          ))}
        </div>

        {/* Second row */}
        <div className="flex justify-center gap-1">
          {shuffledKeys.slice(10, 20).map((key, index) => (
            <div
              key={index + 10}
              className="flex-1 max-w-[40px] bg-amber-50 text-amber-900 p-2 m-1 border-2 border-amber-700 rounded-lg flex flex-col items-center justify-center"
            >
              <div className="text-xs text-amber-600">
                {AZERTY_LAYOUT[index + 10]}
              </div>
              <div className="text-lg font-bold">{key}</div>
            </div>
          ))}
        </div>

        {/* Third row */}
        <div className="flex justify-center gap-1">
          {shuffledKeys.slice(20).map((key, index) => (
            <div
              key={index + 20}
              className="flex-1 max-w-[40px] bg-amber-50 text-amber-900 p-2 m-1 border-2 border-amber-700 rounded-lg flex flex-col items-center justify-center"
            >
              <div className="text-xs text-amber-600">
                {AZERTY_LAYOUT[index + 20]}
              </div>
              <div className="text-lg font-bold">{key}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
