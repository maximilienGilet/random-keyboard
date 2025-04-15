import React from "react";
import { formatTime } from "../utils/time";

interface ScoreModalProps {
  time: number;
  scores: Array<{ time: number }>;
  playerName: string;
  setPlayerName: (name: string) => void;
  showNameInput: boolean;
  setShowNameInput: (show: boolean) => void;
  handleNameSubmit: (e: React.FormEvent) => void;
}

const ScoreModal: React.FC<ScoreModalProps> = ({
  time,
  scores,
  playerName,
  setPlayerName,
  showNameInput,
  setShowNameInput,
  handleNameSubmit,
}) => {
  if (!showNameInput) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-amber-50 p-6 rounded-lg max-w-md w-full">
        <div className="text-center">
          <h2
            id="modal-title"
            className="text-3xl font-bold text-amber-900 mb-6"
          >
            {scores.length === 0 ||
            time < Math.min(...scores.map((s) => s.time / 1000)) ? (
              <>
                <div className="relative">
                  <div className="animate-spin-slow text-6xl mb-4">🏆</div>
                  <div className="absolute -top-2 -right-2 animate-ping text-2xl">
                    ✨
                  </div>
                  <div
                    className="absolute -bottom-2 -left-2 animate-ping text-2xl"
                    style={{ animationDelay: "0.5s" }}
                  >
                    ✨
                  </div>
                  <div
                    className="absolute -top-2 -left-2 animate-ping text-2xl"
                    style={{ animationDelay: "1s" }}
                  >
                    ✨
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 animate-ping text-2xl"
                    style={{ animationDelay: "1.5s" }}
                  >
                    ✨
                  </div>
                </div>
                <div className="animate-bounce text-4xl mt-2">
                  Nouveau Record !
                </div>
              </>
            ) : (
              "Félicitations ! 🎉"
            )}
          </h2>
          <div className="mb-8">
            <p className="text-amber-700 mb-2 text-xl">Votre temps :</p>
            <div className="text-7xl font-bold text-amber-800 mb-4">
              {formatTime(time)}
            </div>
            {scores.length === 0 ||
            time < Math.min(...scores.map((s) => s.time / 1000)) ? (
              <p className="text-amber-600 animate-pulse text-xl">
                Vous êtes un sorcier du clavier ! 🧙‍♂️
              </p>
            ) : (
              <p className="text-amber-600 text-xl">Bien joué !</p>
            )}
          </div>
        </div>
        <form onSubmit={handleNameSubmit} className="space-y-6">
          <div className="text-center">
            <label
              htmlFor="playerName"
              className="block text-amber-900 font-bold mb-2 text-xl"
              id="name-label"
            >
              Votre Nom
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full max-w-md mx-auto p-3 border-2 border-amber-700 rounded-lg bg-amber-50 text-center text-xl"
              placeholder="Entrez votre nom"
              required
              aria-required="true"
              aria-labelledby="name-label"
              autoFocus
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setShowNameInput(false)}
              className="px-6 py-2 border-2 border-amber-700 text-amber-900 hover:bg-amber-100 transition-colors text-lg rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-800 text-amber-50 border-2 border-amber-900 hover:bg-amber-900 transition-colors text-lg rounded-lg"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoreModal;
