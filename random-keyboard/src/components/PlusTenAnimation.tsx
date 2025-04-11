import React, { useEffect, useState } from "react";

interface PlusTenAnimationProps {
  isVisible: boolean;
}

const PlusTenAnimation: React.FC<PlusTenAnimationProps> = ({ isVisible }) => {
  const [position, setPosition] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (isVisible) {
      setPosition(0);
      setOpacity(1);

      const animation = setInterval(() => {
        setPosition((prev) => prev + 1);
        setOpacity((prev) => Math.max(0, prev - 0.02));
      }, 16); // ~60fps

      return () => clearInterval(animation);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed left-1/2 transform -translate-x-1/2 text-2xl font-bold text-red-500"
      style={{
        bottom: `${50 + position}px`,
        opacity: opacity,
        transition: "none",
      }}
    >
      +10
    </div>
  );
};

export default PlusTenAnimation;
