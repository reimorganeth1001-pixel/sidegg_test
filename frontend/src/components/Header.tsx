'use client';

import React, { useContext, useEffect, useState } from 'react';

import { DetailedUserGameDataCtx } from '@/context/detailedGameContext';
import { GameDataCtx } from '@/context/userGameContext';

interface HeaderProps{
    setShowAboutModal: (value: boolean) => void,
    setShowEventFeed: (value: boolean) => void,
    handleDisconnect: () => void,
    // walletAddress: string,  
}

const Header: React.FC<HeaderProps> = ({setShowAboutModal, setShowEventFeed, handleDisconnect}) => {
    const { userGameData } = useContext(
      DetailedUserGameDataCtx
    )   
    
    const [ userScore, setUserScore ] = useState<number>(0);

    const { userGameInfo } = useContext(GameDataCtx);

    useEffect(() => {
      if(userGameInfo.gameId){
        setUserScore(userGameInfo.score)
      }
    }, [userGameInfo]);

    return (
      <header className="flex-none h-[60px] bg-gray-900 border-b border-gray-800">
        <div className="h-full w-full flex items-center justify-between">
          <div className="px-4">
            <img 
              src="/new_sidesgg.svg"
              // src="/Original Logo_Indigo_No_BG.svg"
              alt="sides.gg"
              className="h-8"
            />
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => setShowAboutModal(true)}
              className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500 font-bold
                       hover:opacity-80 transition-opacity mr-4"
            >
              <span className="text-sm bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500 text-transparent">Rules</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="hidden md:flex items-center hover:opacity-80 transition-opacity mr-4"
            >
              {/* <span className="text-sm text-gray-300">{walletAddress}</span> */}
              <span className="text-sm text-red-400">
                Disconnect
              </span>
            </button>

            <button
              onClick={() => setShowEventFeed(true)}
              className="md:hidden text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500 font-bold
                       mr-4"
            >
              <span className="text-sm bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500 text-transparent">Feed</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="md:hidden flex items-center text-sm text-gray-400 hover:text-gray-300 
                       transition-colors mr-4"
            >
              <span className="text-sm text-red-400">Disconnect</span>
            </button>

            <div className="h-[60px] px-4 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-emerald-600">
              <span className="font-bold text-lg text-gray-900">
                Points: {userGameData.userScore ? userGameData.userScore.score.toLocaleString() : userScore}
              </span>
            </div>
          </div>
        </div>
      </header>
    );
}

export default Header;
