import React, { useEffect, useState } from "react";

interface PlusTenAnimationProps {
  isVisible: boolean;
  startPosition: { x: number; y: number };
}

const PlusTenAnimation: React.FC<PlusTenAnimationProps> = ({
  isVisible,
  startPosition,
}) => {
  const [position, setPosition] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isVisible) {
      setPosition(0);
      setOpacity(1);
      setScale(1);

      const animation = setInterval(() => {
        setPosition((prev) => prev + 1);
        setOpacity((prev) => Math.max(0, prev - 0.02));
        setScale((prev) => Math.min(1.3, prev + 0.002));
      }, 16); // ~60fps

      return () => clearInterval(animation);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed text-5xl font-extrabold text-green-500"
      style={{
        left: `${startPosition.x}px`,
        top: `${startPosition.y - position}px`,
        opacity: opacity,
        transform: `scale(${scale})`,
        transition: "none",
        textShadow: "0 0 15px rgba(0, 255, 0, 0.7)",
        WebkitTextStroke: "1.5px black",
      }}
    >
      +10
    </div>
  );
};

export default PlusTenAnimation;
