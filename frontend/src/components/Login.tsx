'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useAccount,
  useDisconnect,
} from 'wagmi';

import {
  formatSupabaseAuthError,
  getOAuthRedirectUrl,
  SUPABASE_OAUTH_PROVIDER,
} from '@/config/auth';
import { getSupabase } from '@/service/supabase';
import { clearStoredWallet, formatShortAddress } from '@/utils/browserWallets';

type Step = 'wallet' | 'x';

const Login = () => {
  const { address, status, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [step, setStep] = useState<Step>('wallet');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address.toLowerCase());
      setStep('x');
      return;
    }

    if (status === 'disconnected') {
      setWalletAddress(null);
      setStep('wallet');
    }
  }, [status, address, isConnected]);

  const handleChangeWallet = () => {
    disconnect();
    clearStoredWallet();
    setWalletAddress(null);
    setStep('wallet');
  };

  const handleXLogin = async () => {
    if (!isConnected) {
      toast.error('Connect your wallet first.');
      return;
    }
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: SUPABASE_OAUTH_PROVIDER,
      options: {
        redirectTo: getOAuthRedirectUrl(),
      },
    });

    if (error) {
      toast.error(formatSupabaseAuthError(error), {
        autoClose: 12000,
        style: { background: '#111827', color: 'white', maxWidth: '420px' },
      });
    }
  };

  const shortLabel = walletAddress
    ? formatShortAddress('evm', walletAddress)
    : '';

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl border border-indigo-500/20">
      <div className="flex justify-center mb-4">
        <img
          src="/new_sidesgg.svg"
          alt="sides.gg"
          className="h-12 w-auto"
        />
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-xl text-gray-300 mb-2">
            Welcome to sides.gg
          </h2>
          {step === 'wallet' ? (
            <p className="text-sm text-gray-400">
              Step 1 of 2 — connect your wallet, then sign in with X
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Step 2 of 2 —{' '}
              <span className="font-mono text-indigo-300">{shortLabel}</span>
            </p>
          )}
        </div>

        {step === 'wallet' && (
          <div className="space-y-3">
            <ConnectButton.Custom>
              {({
                openConnectModal,
                mounted,
              }: {
                mounted: boolean;
                openConnectModal: () => void;
              }) => (
                <button
                  type="button"
                  disabled={!mounted}
                  onClick={openConnectModal}
                  className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 
                           text-white py-3 px-4 rounded-lg hover:from-indigo-700 
                           hover:to-emerald-700 transform hover:scale-[1.02] 
                           transition-all duration-200 font-medium disabled:opacity-60 disabled:transform-none"
                >
                  Connect wallet
                </button>
              )}
            </ConnectButton.Custom>
            <p className="text-xs text-gray-400 text-center">
              MetaMask, Trust Wallet, Coinbase Wallet, and more via WalletConnect.
            </p>
          </div>
        )}

        {step === 'x' && (
          <>
            {isConnected && (
              <div className="flex justify-center scale-95 origin-top">
                <ConnectButton
                  accountStatus="address"
                  showBalance={false}
                  chainStatus="icon"
                />
              </div>
            )}
            <button
              type="button"
              onClick={handleXLogin}
              className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 
                       text-white py-3 px-4 rounded-lg hover:from-indigo-700 
                       hover:to-emerald-700 transform hover:scale-[1.02] 
                       transition-all duration-200 font-medium"
            >
              Login with X
            </button>
            <p className="text-xs text-gray-400 text-center">
              You will be directed to X to authorize the login
            </p>
            <button
              type="button"
              onClick={handleChangeWallet}
              className="w-full text-sm text-gray-500 hover:text-gray-300 py-2 underline-offset-2 hover:underline"
            >
              Use a different wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
