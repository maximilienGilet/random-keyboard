import { useState, useEffect } from "react";

export const useCursorBlink = (interval = 500) => {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, interval);

    return () => clearInterval(blinkInterval);
  }, [interval]);

  return showCursor;
};
