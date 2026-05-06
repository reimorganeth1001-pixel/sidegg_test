'use client';
import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { GameDataCtx } from '@/context/userGameContext';
import { UserInfoCtx } from '@/context/userInfoContext';
import {
  playGame,
  setUserGamePoints,
  updateUser,
  updateUserStatus,
} from '@/utils/functions';
import { GameEventInfoCtx } from '@/context/gameEventInfoContext';

interface SideSelectionModalProps {
  onSideSelect: () => void;
  teamAName: string;
  teamBName: string;
  teamAId: string;
  teamBId: string;
}

const SideSelectionModal = ({ onSideSelect, teamAName, teamBName, teamAId, teamBId }: SideSelectionModalProps) => {
  // Update selectedSide to hold a team name (string) or null.
  const [selectedSide, setSelectedSide] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [pointAmount, setPointAmount] = useState<number>(0);
  const pointsRate = 200; // 1 SOL = 200 points (0.005 SOL = 1 point)
  const MIN_SOL = 0.005;
  const MAX_SOL = 10;
  const [ teamId, setTeamId ] = useState("");
  const { userInfoData, setUserInfoData } = useContext(
    UserInfoCtx
  )
  const { gameEventInfo } = useContext(
    GameEventInfoCtx
  )

  const { userGameInfo, setUserGameInfo } = useContext(
    GameDataCtx
  )

  useEffect(() => {
    console.log(userGameInfo);
  }, [userGameInfo])

  useEffect(() => {
    if(selectedSide == teamAName){
      setTeamId(teamAId);
    }
    else{
      setTeamId(teamBId);
    }
  }, [selectedSide, teamAId, teamAName, teamBId])

  const handleSideSelect = (side: string) => {
    setSelectedSide(side);
  };

  const calculatePoints = useCallback(() => {
    const sol = parseFloat(solAmount);
    if (isNaN(sol)) return 0;
    return Math.floor(sol * pointsRate);
  }, [solAmount, pointsRate]);

  useEffect(() => {
    setPointAmount(calculatePoints);
  },[solAmount, calculatePoints])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (userInfoData.id) {
      
      const playGameResult = await playGame({
        userId: userInfoData.id,
        gameId: gameEventInfo.gameId,
        teamId: teamId,
      });

      if(playGameResult.error){
        return playGameResult.error;
      }
      
      setUserGameInfo({
        gameId: playGameResult?.data?.data?.gameId, // Unique ESPN Game ID
        teamId: teamId,
        score: playGameResult?.data?.data?.score
      })
      
      const updateUserResult = await updateUser({
        userName: userInfoData.userName,
        emailAddr: userInfoData.emailAddr,
        phoneNumber: userInfoData.phoneNumber,
        twitterAccount: userInfoData.twitterAccount,
        updateData: username,
        selectedGameId: gameEventInfo.gameId
      });

      if(updateUserResult.error){
        return updateUserResult.error;
      }

      const updateUserStatusResult = await updateUserStatus({
        userName: userInfoData.userName,
        emailAddr: userInfoData.emailAddr,
        phoneNumber: userInfoData.phoneNumber,
        twitterAccount: userInfoData.twitterAccount,
        updateData: 2,
      });

      if(updateUserStatusResult.error){
        return updateUserStatusResult.error;
      }

      const setUserGamePointsResult = await setUserGamePoints({
        userId: userInfoData.id,
        gameId: gameEventInfo.gameId,
        teamId: teamId,
        initialScore: pointAmount,
      });

      if(setUserGamePointsResult.error){
        return setUserGamePointsResult.error;
      }

      setUserInfoData({ ...userInfoData, userName: username, status: 2 });
     
    }

    if (selectedSide && username.trim() && Number(solAmount) >= MIN_SOL && teamId) {
      onSideSelect();
    }
  };

  const handleSolInput = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSolAmount(value);
    }
  };

  const [invalidAmount, setInvalidAmount] = useState(false);

  const isValid = selectedSide && 
                  username.trim().length > 0 && 
                  Number(solAmount) >= MIN_SOL && 
                  Number(solAmount) <= MAX_SOL;

  return (
    <>
      <div className="hidden sm:flex fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
        <div className="relative max-w-md w-full mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl border border-indigo-500/20">
          <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
            Pick your side
          </h1>

          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
            Stake Your SOL for Game Points (Demo)
          </h2>

          <p className="text-gray-300 mb-6 leading-relaxed">
            Flash Stake your SOL to game points at a rate of 1 Point per 0.005 SOL. During the game, 
            your points balance will go up and down based on your side&apos;s performance. At the end of 
            the game, your points will be converted to your new SOL amount, and deposited to your wallet.
          </p>
          
          <div className="flex gap-4 justify-center mb-8">
            <button
              type="button"
              onClick={() => handleSideSelect(teamAName)}
              className={`px-8 py-4 text-white rounded-lg transform hover:scale-[1.02] transition-all duration-200
                ${selectedSide === teamAName 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900' 
                  : 'bg-gradient-to-r from-indigo-600/80 to-indigo-700/80 hover:from-indigo-600 hover:to-indigo-700'}`}
            >
              {teamAName}
            </button>
            <button
              type="button"
              onClick={() => handleSideSelect(teamBName)}
              className={`px-8 py-4 text-white rounded-lg transform hover:scale-[1.02] transition-all duration-200
                ${selectedSide === teamBName 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 ring-2 ring-emerald-500 ring-offset-2 ring-offset-gray-900' 
                  : 'bg-gradient-to-r from-emerald-600/80 to-emerald-700/80 hover:from-emerald-600 hover:to-emerald-700'}`}
            >
              {teamBName}
            </button>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                You&apos;re Flash Staking:
              </label>
              <input
                type="text" // Changed from "number" to "text"
                value={solAmount}
                onChange={(e) => {
                  setInvalidAmount(false);
                  const inputValue = e.target.value;
                  
                  // Allow empty, "0", "0.", and valid decimal numbers
                  if (inputValue === '' || inputValue === '0' || inputValue === '0.' || /^\d*\.?\d*$/.test(inputValue)) {
                    handleSolInput(inputValue);
                    
                    // Only validate complete numbers (not partial inputs like "0.")
                    if (inputValue !== '' && inputValue !== '0.' && inputValue !== '.') {
                      const value = Number(inputValue);
                      if (value < MIN_SOL || value > MAX_SOL) {
                        setInvalidAmount(true);
                      }
                    }
                  }
                }}
                placeholder="Enter SOL Amount"
                className={`w-full px-4 py-2 bg-gray-800 border border-gray-700 
                  rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                  text-gray-100 placeholder-gray-500 
                  ${invalidAmount ? 'border-red-500' : ''}`}
                // min={MIN_SOL}
                // max={MAX_SOL}
              />

              <p className="mt-1 text-xs text-gray-400">
                Range: {MIN_SOL} SOL - {MAX_SOL} SOL
              </p>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Points You&apos;ll Receive:
              </label>
              <div className="w-full px-4 py-2 bg-gray-800 border border-gray-700 
                            rounded-lg text-gray-100">
                {calculatePoints().toLocaleString()}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-medium text-center text-gray-300">
              Enter username:
            </h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username will be used in the chat"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 
                      rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                      text-gray-100 placeholder-gray-500"
            />
            
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full mt-8 py-3 rounded-lg text-white font-medium
                transform transition-all duration-200 
                ${isValid 
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 hover:scale-[1.02]' 
                  : 'bg-gray-950 cursor-not-allowed opacity-60'}`}
            >
              {isValid ? 'Confirm Flash Stake and Enter Chat' : 'Select a side, enter amount and username'}
            </button>
          </form>
        </div>
      </div>

      <div className="sm:hidden fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-900 rounded-lg sm:rounded-xl shadow-xl border border-indigo-500/20">
          
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
            Pick your side
          </h1>

          {/* Subheading */}
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
            Stake Your SOL for Game Points (Demo)
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
            Flash Stake your SOL to game points at a rate of 1 Point per 0.005 SOL. During the game, 
            your points balance will go up and down based on your side&apos;s performance. At the end of 
            the game, your points will be converted to your new SOL amount, and deposited to your wallet.
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <button
              type="button"
              onClick={() => handleSideSelect(teamAName)}
              className={`px-8 py-4 text-white rounded-lg transform hover:scale-[1.02] transition-all duration-200
                ${selectedSide === teamAName 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900' 
                  : 'bg-gradient-to-r from-indigo-600/80 to-indigo-700/80 hover:from-indigo-600 hover:to-indigo-700'}`}
            >
              {teamAName}
            </button>
            <button
              type="button"
              onClick={() => handleSideSelect(teamBName)}
              className={`px-8 py-4 text-white rounded-lg transform hover:scale-[1.02] transition-all duration-200
                ${selectedSide === teamBName 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 ring-2 ring-emerald-500 ring-offset-2 ring-offset-gray-900' 
                  : 'bg-gradient-to-r from-emerald-600/80 to-emerald-700/80 hover:from-emerald-600 hover:to-emerald-700'}`}
            >
              {teamBName}
            </button>
          </div>

          {/* Input Fields */}
          <div className="flex gap-4 mb-6 sm:mb-8">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                You&apos;re Flash Staking:
              </label>
              <input
                type="text" // Changed from "number" to "text"
                value={solAmount}
                onChange={(e) => {
                  setInvalidAmount(false);
                  const inputValue = e.target.value;
                  
                  // Allow empty, "0", "0.", and valid decimal numbers
                  if (inputValue === '' || inputValue === '0' || inputValue === '0.' || /^\d*\.?\d*$/.test(inputValue)) {
                    handleSolInput(inputValue);
                    
                    // Only validate complete numbers (not partial inputs like "0.")
                    if (inputValue !== '' && inputValue !== '0.' && inputValue !== '.') {
                      const value = Number(inputValue);
                      if (value < MIN_SOL || value > MAX_SOL) {
                        setInvalidAmount(true);
                      }
                    }
                  }
                }}
                placeholder="Enter SOL Amount"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 
                          rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                          text-gray-100 placeholder-gray-500 text-sm sm:text-base ${invalidAmount ? 'border-red-500' : ''}`}
                // min={MIN_SOL}
                // max={MAX_SOL}
              />
              <p className="mt-1 text-xs text-gray-400">
                Range: {MIN_SOL} SOL - {MAX_SOL} SOL
              </p>
            </div>

            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Points You&apos;ll Receive:
              </label>
              <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm sm:text-base">
                {calculatePoints().toLocaleString()}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <h2 className="text-sm sm:text-lg font-medium text-center text-gray-300">
              Enter username:
            </h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username will be used in the chat"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 
                        rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                        text-gray-100 placeholder-gray-500 text-sm sm:text-base"
            />

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 sm:py-4 rounded-lg text-white font-medium
                transform transition-all duration-200 text-sm sm:text-base
                ${isValid 
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 hover:scale-[1.02]' 
                  : 'bg-gray-950 cursor-not-allowed opacity-60'}`}
            >
              {isValid ? 'Confirm Flash Stake and Enter Chat' : 'Select a side, enter amount and username'}
            </button>
          </form>
        </div>
      </div>

    </>
  );
};

export default SideSelectionModal;
