// src/components/EventFeed.tsx
'use client';
import { DetailedUserGameDataCtx } from '@/context/detailedGameContext';
import { useEffect, useContext } from 'react';

interface EventFeedProps {
  onClose: () => void;
}

const EventFeed = ({ onClose }: EventFeedProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const { userGameData } = useContext(
    DetailedUserGameDataCtx
  )

  return (
    <div className="sm:flex fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-w-2xl w-[calc(100%-24px)] mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl border border-indigo-500/20 max-h-[90vh] overflow-hidden [transform:scaleY(0.95)]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Close dialog"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h1 className="text-3xl font-bold mb-3 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
          Event Feed
        </h1>

        {/* Scrollable Content with Bottom Padding */}
        <div className="overflow-y-auto max-h-[70vh] px-2 py-4 space-y-2 text-gray-200 ">
          {userGameData?.gameActions?.data?.length ? (
            userGameData.gameActions.data.slice().reverse().map((event, index) => (
              <div key={index} className="text-left py-1.5 px-3 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300 flex-1">
                    {event.action === "End Game" ? "Winner" : event.action}
                  </span>
                  <span className={`${event.points > 0 ? 'text-emerald-400' : 'text-red-400'} mx-2`}>
                    {event.points > 0 ? '+' : ''}{event.points}
                  </span>
                  <span className="text-gray-500 whitespace-nowrap">
                    Side {event.side} • Q{event.time.period} {event.time.displayValue}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-left py-1.5 px-3 bg-gray-800 rounded-lg animate-pulse">
              <div className="flex justify-between items-center text-xs">
                <span className="bg-gray-700 h-3 w-20 rounded-md"></span>
                <span className="bg-gray-700 h-3 w-10 rounded-md"></span>
                <span className="bg-gray-700 h-3 w-24 rounded-md"></span>
              </div>
              <div className="min-h-[100px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button Fixed at Bottom */}
        <button
          onClick={onClose}
          className="w-full mt-3 py-3 rounded-lg text-white font-medium
            bg-gradient-to-r from-indigo-600 to-emerald-600 
            hover:from-indigo-700 hover:to-emerald-700 
            transform hover:scale-[1.02] transition-all duration-200"
        >
          Close
        </button>

      </div>
    </div>

  );
};

export default EventFeed;
