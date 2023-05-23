import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet, polygon, sepolia, optimism } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { alchemyProvider } from 'wagmi/providers/alchemy'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet,sepolia, polygon, optimism],
  [alchemyProvider({ apiKey: 'XKPiMtwFq250k3ejZbSwU3N95DkoGVLd' }), publicProvider()],
)
const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  webSocketPublicClient,
  publicClient,
})


interface InitProps {
  children: React.ReactNode;
}

const Init = ({ children }: InitProps) => {
  return (
    <div>
      <WagmiConfig config={config}>
      {children}
      </WagmiConfig>
      {/* <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> */}
    </div>
  );
};

export default Init;
