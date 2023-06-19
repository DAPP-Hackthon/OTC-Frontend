import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { avalanche, bsc, polygon } from "@wagmi/core/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { alchemyProvider } from "wagmi/providers/alchemy";
//   import { publicProvider } from 'wagmi/providers/public'
//   import { InjectedConnector } from 'wagmi/connectors/injected'
import { infuraProvider } from "wagmi/providers/infura";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

const { chains, publicClient } = configureChains([bsc,avalanche], [publicProvider()]);

const config = createConfig({
	autoConnect: true,
	connectors: [
		new MetaMaskConnector({ chains }),
		new CoinbaseWalletConnector({
			chains,
			options: {
				appName: "Adventure Dao",
				appLogoUrl:
					"https://png.pngtree.com/png-vector/20211106/ourlarge/pngtree-pizza-pixel-png-image_4023257.png",
			},
		}),
	],
	publicClient,
});

interface InitProps {
  children: React.ReactNode;
}

const Init = ({ children }: InitProps) => {
  return (
    <div>
      <WagmiConfig config={config}>{children}</WagmiConfig>
      {/* <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> */}
    </div>
  );
};

export default Init;
