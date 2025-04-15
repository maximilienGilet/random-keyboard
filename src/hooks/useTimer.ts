import { useState, useEffect } from "react";

export const useTimer = (isRunning: boolean) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = () => {
    setTime(0);
  };

  const addTime = (seconds: number) => {
    setTime((prev) => prev + seconds);
  };

  return { time, reset, addTime };
};
