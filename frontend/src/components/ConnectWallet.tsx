'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ConnectWalletProps {
  onClose: () => void;
  onConnect: () => void;
}

const ConnectWallet = ({ onClose, onConnect }: ConnectWalletProps) => {
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-xl w-[calc(100%-24px)] mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl border border-indigo-500/20">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-6 w-6 text-gray-400 hover:text-gray-200" />
        </button>

        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
          Connect Wallet to Play
        </h1>
        
        <div className="space-y-6 text-gray-200">
          <div>
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
              Coming Soon: Flash Staking
            </h2>
            
            <p className="leading-relaxed">
              Flash Stake your SOL for game points during the sporting event! Your points balance will display for you, in the event chat, and will fluctuate based on real-time activity in the game. After the event, your new points balance will be automatically converted back to SOL, which will be deposited into your wallet. It&apos;s simple, and a new way to take your second-screen viewing experience to another level of excitement!
            </p>
          </div>

          <button
            onClick={onConnect}
            className="w-full py-3 rounded-lg text-white font-medium
              bg-gradient-to-r from-indigo-600 to-emerald-600 
              hover:from-indigo-700 hover:to-emerald-700 
              transform hover:scale-[1.02] transition-all duration-200"
          >
            Continue to Demo
          </button>

          {/* <p className="hidden text-sm text-gray-400 text-center">
            By connecting your wallet, you acknowledge that you have read, understand and accept the terms in the{' '}
            <Link 
              href="/disclaimer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              disclaimer
            </Link>
            .
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
