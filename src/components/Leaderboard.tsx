import React from "react";
import { formatTime } from "../utils/time";

export interface Score {
  name: string;
  time: number;
  date: string;
}

interface LeaderboardProps {
  scores: Score[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  return (
    <div className="bg-amber-50 p-4 border-4 border-amber-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">🏆 Scores</h2>
      <div className="space-y-2">
        {scores.map((score, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-amber-100 p-2 rounded"
          >
            <div className="flex items-center space-x-2">
              <span className="text-amber-900 font-bold">{index + 1}.</span>
              <span className="text-amber-800">{score.name}</span>
            </div>
            <div className="text-amber-700 font-mono">
              {formatTime(Math.floor(score.time / 1000))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
