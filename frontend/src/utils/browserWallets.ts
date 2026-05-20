/**
 * Injected browser wallets:
 * - EVM: MetaMask, Trust Wallet, Brave Wallet, Coinbase Wallet extension, etc. (`window.ethereum`)
 * - Solana: Phantom, Solflare, Backpack, etc. (`window.solana` / `window.phantom.solana`)
 */

export type WalletChain = 'evm' | 'solana';

export type StoredWalletSession = {
  chain: WalletChain;
  address: string;
};

const SESSION_KEY = 'sides_wallet_session';
/** @deprecated legacy plain Solana pubkey */
const LEGACY_SOLANA_KEY = 'sides_connected_wallet';

type Ethereumish = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  providers?: Ethereumish[];
  isMetaMask?: boolean;
};

export type SolanaProvider = {
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toBase58: () => string } } | void>;
  disconnect?: () => Promise<void>;
  publicKey?: { toBase58: () => string };
};

type InjectedWindow = Window & {
  ethereum?: Ethereumish;
  phantom?: { solana?: SolanaProvider };
  solana?: SolanaProvider;
};

function readSession(): StoredWalletSession | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as StoredWalletSession;
      if (
        parsed &&
        (parsed.chain === 'evm' || parsed.chain === 'solana') &&
        typeof parsed.address === 'string' &&
        parsed.address.length > 0
      ) {
        return parsed;
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }
  const legacy = sessionStorage.getItem(LEGACY_SOLANA_KEY);
  if (legacy) {
    sessionStorage.removeItem(LEGACY_SOLANA_KEY);
    const session: StoredWalletSession = { chain: 'solana', address: legacy };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  return null;
}

function writeSession(session: StoredWalletSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getStoredWallet(): StoredWalletSession | null {
  return readSession();
}

export function clearStoredWallet(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(LEGACY_SOLANA_KEY);
}

/** Prefer MetaMask when multiple EIP-1193 providers are injected (common with Trust + MetaMask). */
export function getInjectedEthereum(): Ethereumish | null {
  if (typeof window === 'undefined') return null;
  const eth = (window as InjectedWindow).ethereum;
  if (!eth) return null;
  const multi = eth.providers;
  if (Array.isArray(multi) && multi.length > 0) {
    const metaMask = multi.find(p => p.isMetaMask);
    return metaMask ?? multi[0];
  }
  return eth;
}

export function getInjectedSolana(): SolanaProvider | null {
  if (typeof window === 'undefined') return null;
  const w = window as InjectedWindow;
  return w.phantom?.solana ?? w.solana ?? null;
}

export function hasInjectedEthereum(): boolean {
  return getInjectedEthereum() !== null;
}

export function hasInjectedSolana(): boolean {
  return getInjectedSolana() !== null;
}

export async function connectEvmWallet(): Promise<string> {
  const ethereum = getInjectedEthereum();
  if (!ethereum) {
    throw new Error(
      'No Ethereum browser wallet found. Install MetaMask, Trust Wallet, Brave Wallet, or another EVM wallet extension.',
    );
  }
  const accounts = (await ethereum.request({
    method: 'eth_requestAccounts',
    params: [],
  })) as string[];
  const address = accounts?.[0];
  if (!address || typeof address !== 'string') {
    throw new Error('Wallet did not return an Ethereum address.');
  }
  const normalized = address.toLowerCase();
  writeSession({ chain: 'evm', address: normalized });
  return normalized;
}

export async function connectSolanaWallet(): Promise<string> {
  const provider = getInjectedSolana();
  if (!provider) {
    throw new Error('No Solana wallet found. Install Phantom, Solflare, or another Solana wallet.');
  }
  const result = await provider.connect();
  const pk =
    (result && 'publicKey' in result && result.publicKey?.toBase58?.()) ??
    provider.publicKey?.toBase58?.();
  if (!pk) {
    throw new Error('Wallet did not return a public key.');
  }
  writeSession({ chain: 'solana', address: pk });
  return pk;
}

export async function disconnectWallet(): Promise<void> {
  const session = readSession();
  clearStoredWallet();
  if (session?.chain === 'solana') {
    const provider = getInjectedSolana();
    try {
      await provider?.disconnect?.();
    } catch {
      /* ignore */
    }
  }
}

export function formatShortAddress(chain: WalletChain, address: string): string {
  if (!address) return '';
  if (chain === 'evm' && address.startsWith('0x') && address.length > 10) {
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  }
  if (address.length > 10) {
    return `${address.slice(0, 4)}…${address.slice(-4)}`;
  }
  return address;
}
