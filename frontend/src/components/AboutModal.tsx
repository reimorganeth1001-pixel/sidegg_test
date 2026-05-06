'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal = ({ onClose }: AboutModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="sm:flex fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-2xl w-[calc(100%-24px)] mx-auto my-2 p-6 bg-gray-900 rounded-xl shadow-2xl border border-indigo-500/20 max-h-[90vh] overflow-hidden [transform:scaleY(0.95)]">
        <div className=''>
      
        {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-6 w-6 text-gray-400 hover:text-gray-200" />
          </button>

          <h1 className="text-3xl font-bold mb-3 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
            About the Game
          </h1>
          
          <div className="overflow-y-auto max-h-[70vh] px-2 py-4 space-y-6 text-gray-200">
            <p className="leading-relaxed">
              Experience our <span className="font-bold">points-based sports game</span> with full on-chain
              transparency. Get an invite code when shared by our team on X (or other ways), connect your
              Solana wallet, pick a side, and watch your points grow or shrink in real-time based on action
              in the sporting event. Each point is priced at 0.005 SOL (based on fair market value at the
              time of staking). At match end, your final balance is instantly redeemable—no fiat required,
              all powered by Solana.
            </p>

            <div>
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
                Points Game Rules
              </h2>
              <ul className="space-y-2 list-inside">
                <li className="flex gap-2">
                  <span className="font-bold min-w-[120px]">Invite Codes:</span>
                  <span>Obtain a limited invite code from our X profile to unlock the next match event.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold min-w-[120px]">SOL Staking:</span>
                  <span>Connect your Solana wallet and stake an amount of SOL on your chosen side (A or B based on the team you like).</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold min-w-[120px]">On-Chain Ratios:</span>
                  <span>Game events update each side&apos;s ratio on-chain; your points reflect your stake × side ratio.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold min-w-[120px]">Live Updates:</span>
                  <span>See your real-time points in a shared chat—no hidden off-chain balances.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold min-w-[120px]">Game End:</span>
                  <span>When the match finishes, you finalize and redeem your stake in SOL, based on the final ratio.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold min-w-[120px]">No Fiat:</span>
                  <span>Bring your own SOL; we do not accept or process any direct fiat payments at this time.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold min-w-[120px]">Decentralized:</span>
                  <span>All key transactions occur on-chain, ensuring fairness and full verifiability.</span>
                </li>
              </ul>
            </div>

            <div className="overflow-x-auto">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
                NBA Basketball Points System
              </h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 text-left text-gray-300">Event Action</th>
                    <th className="py-2 text-right text-gray-300">Points Value</th>
                    <th className="py-2 text-right text-gray-300">Points Impact (Other Team)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 pb-10">
                  {[
                    ['Winner', 30, -30],
                    ['Field Goal Made (2PT)', 10, -10],
                    ['Three-Point Made (3PT)', 15, -15],
                    // ['Field Goal Missed', -3, -3],
                    // ['Three-Point Missed', -5, -5],
                    ['Free Throw Made', 5, -5],
                    // ['Free Throw Missed', -2, -2],
                    ['Offensive Rebound', 5, -5],
                    ['Defensive Rebound', 5, -5],
                    ['Assist', 5, -5],
                    ['Steal', 5, -5],
                    ['Block', 5, -5],
                    ['Turnover', -10, 10],
                    ['Foul Committed', -10, 10],
                    ['Technical Foul', -15, 15],
                  ].map(([action, points, impact], index) => (
                    <tr key={index}>
                      <td className="py-2 text-gray-300">{action}</td>
                      <td className="py-2 text-right text-gray-300">{points}</td>
                      <td className="py-2 text-right text-gray-300">{impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

             {/* Close Button Fixed at Bottom */}
          {/* <div className="sticky bottom-0 left-0 right-0 bg-gray-900 mt-10 shadow-md"> */}
          <button
            onClick={onClose}
            className="w-full mt-3 py-3 rounded-lg text-white font-medium
              bg-gradient-to-r from-indigo-600 to-emerald-600 
              hover:from-indigo-700 hover:to-emerald-700 
              transform hover:scale-[1.02] transition-all duration-200"
          >
            Close
          </button>
          {/* </div> */}

        </div>
      </div>
    </div>
  );
};

export default AboutModal;
