export const formatTime = (time: number): string => {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
