import React, { useContext } from 'react';
import { DetailedUserGameDataCtx } from '@/context/detailedGameContext';

const GameEventBar = () => {
  const { userGameData } = useContext(
    DetailedUserGameDataCtx
  )

  return (
    <div className="hidden md:block w-[300px] flex-none bg-gray-900 overflow-y-auto border-l border-gray-800 order-1 md:order-2">
      <div className="grid grid-cols-1 gap-1.5 p-1.5">
        {userGameData?.gameActions?.data?.length ? (
          userGameData.gameActions.data.slice().reverse().map((event, index) => (
            <div key={index} className="text-left py-1.5 px-2 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 flex-1">
                  {event.action === "End Game" ? "Winner" : event.action}
                </span>
                {/* {userGameInfo.teamId === event.teamId ? ( */}
                  <span className={`${event.points > 0 ? 'text-emerald-400' : 'text-red-400'} mx-2`}>
                    {event.points > 0 ? '+' : ''}{event.points}
                  </span>
                {/* ) : (
                  <span className={`${event.points > 0 ? 'text-red-400' : 'text-emerald-400'} mx-2`}>
                    {event.points > 0 ? `-${event.points}` : `+${Math.abs(event.points)}`}
                  </span>
                )} */}
                <span className="text-gray-500 whitespace-nowrap">
                  Side {event.side} • Q{event.time.period} {event.time.displayValue}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-left py-1.5 px-2 bg-gray-800 rounded-lg animate-pulse">
            <div className="flex justify-between items-center text-xs">
              <span className="bg-gray-700 h-3 w-16 rounded-md"></span>
              <span className="bg-gray-700 h-3 w-8 rounded-md"></span>
              <span className="bg-gray-700 h-3 w-20 rounded-md"></span>
            </div>
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin">
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameEventBar;
