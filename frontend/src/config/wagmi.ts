import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia,
} from 'wagmi/chains';

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

/**
 * RainbowKit + wagmi. WalletConnect `projectId` is required for the modal’s
 * WalletConnect / mobile flows; get a free id at https://cloud.walletconnect.com
 * Injected wallets (MetaMask, etc.) still work with a placeholder, but WC may fail.
 */
export const wagmiConfig = getDefaultConfig({
  appName: 'sides.gg',
  projectId:
    walletConnectProjectId ||
    '00000000000000000000000000000000',
  chains: [mainnet, sepolia],
  ssr: true,
});
