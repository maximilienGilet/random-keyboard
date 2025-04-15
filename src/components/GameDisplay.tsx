import React from "react";
import VirtualKeyboard from "./VirtualKeyboard";
import PlusTenAnimation from "./PlusTenAnimation";
import { useCursorBlink } from "../hooks/useCursorBlink";
import { formatTime } from "../utils/time";

interface GameDisplayProps {
  targetPhrase: string;
  currentPhrase: string;
  time: number;
  timerRef: React.RefObject<HTMLDivElement>;
  isKeyboardVisible: boolean;
  shuffledKeys: string[];
  hasStarted: boolean;
  showPlusTen: boolean;
  timerPosition: { x: number; y: number };
  handleStart: () => void;
  handleShowKeyboard: () => void;
  handleRestart: () => void;
  isComplete: boolean;
}

const GameDisplay: React.FC<GameDisplayProps> = ({
  targetPhrase,
  currentPhrase,
  time,
  timerRef,
  isKeyboardVisible,
  shuffledKeys,
  hasStarted,
  showPlusTen,
  timerPosition,
  handleStart,
  handleShowKeyboard,
  handleRestart,
  isComplete,
}) => {
  const showCursor = useCursorBlink();

  return (
    <div className="flex-1">
      <h1 className="text-4xl font-bold text-center mb-8 text-amber-900">
        Défi Clavier Aléatoire
      </h1>

      <div className="bg-amber-50 p-6 border-4 border-amber-800 mb-6 shadow-lg rounded-lg">
        <div className="mb-4">
          <p className="text-xl mb-2 text-amber-900 font-bold">
            Phrase à taper :
          </p>
          <div className="text-xl tracking-wider bg-amber-50 p-4 border-2 border-amber-700 rounded-lg">
            {targetPhrase}
          </div>
        </div>
        <div className="mb-4">
          <p className="text-xl mb-2 text-amber-900 font-bold">
            Phrase actuelle :
          </p>
          <div className="text-xl tracking-wider bg-amber-50 p-4 border-2 border-amber-700 rounded-lg">
            {currentPhrase}
            <span
              className={`inline-block w-2 h-6 bg-amber-900 align-middle ${
                showCursor ? "opacity-100" : "opacity-0"
              }`}
            ></span>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-xl mb-2 text-amber-900 font-bold">Temps :</p>
          <div
            ref={timerRef}
            className="text-5xl font-bold text-amber-900 bg-amber-50 p-6 text-center border-4 border-amber-800 rounded-lg"
          >
            <span className="tracking-wider">{formatTime(time)}</span>
          </div>
        </div>

        {!hasStarted ? (
          <button
            onClick={handleStart}
            className="w-full mb-4 px-6 py-3 bg-amber-800 text-amber-50 border-2 border-amber-900 hover:bg-amber-900 transition-colors font-bold rounded-lg"
          >
            Démarrer le Défi
          </button>
        ) : !isComplete ? (
          <button
            onClick={handleShowKeyboard}
            className={`w-full mb-4 px-6 py-3 border-2 transition-colors font-bold rounded-lg ${
              isKeyboardVisible
                ? "bg-amber-200 text-amber-600 cursor-not-allowed border-amber-400"
                : "bg-amber-800 text-amber-50 hover:bg-amber-900 border-amber-900"
            }`}
            disabled={isKeyboardVisible}
          >
            Afficher le Clavier (+10s de pénalité)
          </button>
        ) : null}

        {isComplete && (
          <button
            onClick={handleRestart}
            className="w-full mt-4 px-6 py-3 bg-amber-800 text-amber-50 border-2 border-amber-900 hover:bg-amber-900 transition-colors font-bold rounded-lg"
          >
            Nouveau Défi
          </button>
        )}
      </div>

      <VirtualKeyboard
        isVisible={isKeyboardVisible}
        shuffledKeys={shuffledKeys}
        hasStarted={hasStarted}
      />

      {showPlusTen && (
        <PlusTenAnimation
          isVisible={showPlusTen}
          startPosition={timerPosition}
        />
      )}
    </div>
  );
};

export default GameDisplay;
