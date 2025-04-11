import React, { useEffect, useState } from "react";

interface PlusTenAnimationProps {
  isVisible: boolean;
  startPosition: { x: number; y: number };
}

const PlusTenAnimation: React.FC<PlusTenAnimationProps> = ({
  isVisible,
  startPosition,
}) => {
  const [position, setPosition] = useState(startPosition);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (isVisible) {
      setPosition(startPosition);
      setOpacity(1);

      const interval = setInterval(() => {
        setPosition((prev) => ({
          x: prev.x,
          y: prev.y - 2,
        }));
        setOpacity((prev) => prev - 0.02);
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isVisible, startPosition]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed text-2xl font-bold text-amber-800"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: opacity,
        transform: "translate(-50%, -50%)",
      }}
    >
      +10s
    </div>
  );
};

export default PlusTenAnimation;
