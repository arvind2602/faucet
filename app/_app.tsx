// _app.tsx

import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import '../styles/globals.css';

const network = WalletAdapterNetwork.Devnet; // or Testnet, MainnetBeta
const endpoint = clusterApiUrl(network);
const wallets = [getPhantomWallet()];

import { ReactNode } from 'react';

function MyApp({ Component, pageProps }: { Component: ReactNode, pageProps: any }) {
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <Component {...pageProps} />
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default MyApp;
