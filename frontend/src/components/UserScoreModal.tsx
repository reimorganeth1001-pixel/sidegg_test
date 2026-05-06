import React, { useEffect, useState } from "react";

interface ScoreModalProps {
    userScore: string;
    onClose: () => void
    getOrLossScore: number;
    getOrLossSol: number;
    startScore: number;
    startSol: number;
}

const ScoreModal:React.FC<ScoreModalProps> = ({ userScore, onClose, startScore, startSol }) => {

  const [userScoreInSol, setUserScoreInSol] = useState<number>(0);

  useEffect(() => {
    setUserScoreInSol(Number(userScore) / 200);
  }, [userScore]);


  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 z-50">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md p-6 mx-auto bg-gray-900 rounded-xl shadow-2xl border border-indigo-500/20
        sm:max-w-lg md:max-w-2xl">
        
        {/* Modal Title */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-transparent bg-clip-text 
          bg-gradient-to-r from-indigo-500 to-emerald-500">
          Your Results
        </h1>

        {/* Score Display */}
        <p className="text-gray-300 text-lg text-center mb-6">
          <span className="font-semibold text-indigo-400">Your Starting Points:</span> 
          <span className="text-white ml-2">{startScore}</span>
        </p>
        <p className="text-gray-300 text-lg text-center mb-6">
          <span className="font-semibold text-indigo-400">Your Starting SOL:</span> 
          <span className="text-white ml-2">{startSol}</span>
        </p>
        <p className="text-gray-300 text-lg text-center mb-6">
          <span className="font-semibold text-indigo-400">Your Ending Points:</span> 
          <span className="text-white ml-2">{userScore}</span>
        </p>
        <p className="text-gray-300 text-lg text-center mb-6">
          <span className="font-semibold text-indigo-400">Your Ending SOL:</span> 
          <span className="text-white ml-2">{userScoreInSol}</span>
        </p>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg text-white font-medium transform transition-all duration-200
            bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 hover:scale-[1.02]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ScoreModal;
